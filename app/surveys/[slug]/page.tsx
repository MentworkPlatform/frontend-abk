'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ApiError, apiClient } from '@/lib/api-client'

type SurveyOptionViewModel = {
  id: string
  label: string
  value: string
  order: number
}

type SurveyQuestionViewModel = {
  id: string
  questionText: string
  questionType: string
  isRequired: boolean
  order: number
  options: SurveyOptionViewModel[]
}

type SurveyViewModel = {
  id: string
  title: string
  slug: string
  isActive: boolean
  questions: SurveyQuestionViewModel[]
}

type SurveyAnswerValue = string | string[]

type SurveyAnswerMap = Record<string, SurveyAnswerValue>

type SurveySubmissionResponseItem = {
  questionId: string
  questionType: string
  answer: string | string[]
  selectedOptions?: string[]
  text?: string
}

type SurveySubmissionPayload = {
  surveyId: string
  surveySlug: string
  responses: SurveySubmissionResponseItem[]
  answers: SurveySubmissionResponseItem[]
  metadata: {
    source: string
    submittedAt: string
  }
}

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return null
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value)

      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
  }

  return null
}

const decodeSlug = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const mapSurveyResponse = (payload: unknown, fallbackSlug: string): SurveyViewModel => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const surveyRecord =
    asObject(root?.survey) ??
    asObject(dataRecord?.survey) ??
    dataRecord ??
    root ??
    null

  if (!surveyRecord) {
    throw new Error('Survey payload is missing survey data.')
  }

  const questionsArray = Array.isArray(surveyRecord.questions)
    ? surveyRecord.questions
    : []

  const questions = questionsArray
    .map((questionItem, index) => {
      const questionRecord = asObject(questionItem)

      if (!questionRecord) {
        return null
      }

      const optionsArray = Array.isArray(questionRecord.options)
        ? questionRecord.options
        : []
      const options = optionsArray
        .map((optionItem, optionIndex) => {
          const optionRecord = asObject(optionItem)

          if (!optionRecord) {
            return null
          }

          return {
            id:
              pickString(optionRecord.id, optionRecord.optionId) ??
              `option-${index + 1}-${optionIndex + 1}`,
            label:
              pickString(optionRecord.label, optionRecord.text) ??
              pickString(optionRecord.value) ??
              `Option ${optionIndex + 1}`,
            value:
              pickString(optionRecord.value, optionRecord.label) ??
              `option-${optionIndex + 1}`,
            order: pickNumber(optionRecord.order, optionRecord.position) ?? optionIndex + 1,
          } satisfies SurveyOptionViewModel
        })
        .filter((item): item is SurveyOptionViewModel => Boolean(item))
        .sort((a, b) => a.order - b.order)

      return {
        id:
          pickString(questionRecord.id, questionRecord.questionId) ??
          `question-${index + 1}`,
        questionText:
          pickString(questionRecord.questionText, questionRecord.text) ??
          `Question ${index + 1}`,
        questionType: pickString(questionRecord.questionType, questionRecord.type) ?? 'TEXT',
        isRequired: Boolean(questionRecord.isRequired),
        order: pickNumber(questionRecord.order, questionRecord.position) ?? index + 1,
        options,
      } satisfies SurveyQuestionViewModel
    })
    .filter((item): item is SurveyQuestionViewModel => Boolean(item))
    .sort((a, b) => a.order - b.order)

  return {
    id: pickString(surveyRecord.id) ?? fallbackSlug,
    title: pickString(surveyRecord.title) ?? 'Survey',
    slug: pickString(surveyRecord.slug, fallbackSlug) ?? fallbackSlug,
    isActive: Boolean(surveyRecord.isActive ?? true),
    questions,
  }
}

const normalizeQuestionType = (questionType: string) => {
  const normalizedType = questionType.toUpperCase()

  if (normalizedType.includes('MULTIPLE')) {
    return 'MULTIPLE_CHOICE'
  }

  if (normalizedType.includes('RATING')) {
    return 'RATING'
  }

  if (normalizedType.includes('SINGLE')) {
    return 'SINGLE_CHOICE'
  }

  if (normalizedType.includes('TEXT')) {
    return 'TEXT'
  }

  return normalizedType
}

const isAnswerProvided = (
  question: SurveyQuestionViewModel,
  answerValue: SurveyAnswerValue | undefined,
) => {
  const questionType = normalizeQuestionType(question.questionType)

  if (questionType === 'MULTIPLE_CHOICE') {
    return Array.isArray(answerValue) && answerValue.length > 0
  }

  if (typeof answerValue !== 'string') {
    return false
  }

  return answerValue.trim().length > 0
}

const buildSubmissionResponses = (
  survey: SurveyViewModel,
  answers: SurveyAnswerMap,
): SurveySubmissionResponseItem[] =>
  survey.questions.map((question) => {
    const answerValue = answers[question.id]
    const normalizedType = normalizeQuestionType(question.questionType)
    const normalizedAnswer =
      normalizedType === 'MULTIPLE_CHOICE'
        ? Array.isArray(answerValue)
          ? answerValue
          : []
        : typeof answerValue === 'string'
          ? answerValue.trim()
          : ''

    return {
      questionId: question.id,
      questionType: question.questionType,
      answer: normalizedAnswer,
      selectedOptions: Array.isArray(normalizedAnswer) ? normalizedAnswer : undefined,
      text: typeof normalizedAnswer === 'string' ? normalizedAnswer : undefined,
    }
  })

function SurveyQuestionField({
  question,
  value,
  onChange,
  disabled,
}: {
  question: SurveyQuestionViewModel
  value: SurveyAnswerValue | undefined
  onChange: (nextValue: SurveyAnswerValue) => void
  disabled: boolean
}) {
  const normalizedType = normalizeQuestionType(question.questionType)

  if (normalizedType === 'TEXT') {
    return (
      <Textarea
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder='Type your response'
        disabled={disabled}
      />
    )
  }

  if (normalizedType === 'MULTIPLE_CHOICE') {
    const selectedValues = Array.isArray(value) ? value : []

    return (
      <div className='space-y-2'>
        {question.options.map((option) => (
          <label
            key={option.id}
            className='flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm'
          >
            <input
              type='checkbox'
              className='h-4 w-4'
              checked={selectedValues.includes(option.value)}
              onChange={(event) => {
                if (event.target.checked) {
                  onChange([...selectedValues, option.value])
                } else {
                  onChange(selectedValues.filter((item) => item !== option.value))
                }
              }}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    )
  }

  const optionList =
    question.options.length > 0
      ? question.options
      : normalizedType === 'RATING'
        ? Array.from({ length: 5 }, (_, index) => ({
            id: `${question.id}-rating-${index + 1}`,
            label: `${index + 1}`,
            value: `${index + 1}`,
            order: index + 1,
          }))
        : []

  if (optionList.length === 0) {
    return (
      <div className='rounded-md border border-dashed p-3 text-sm text-muted-foreground'>
        No selectable options configured for this question.
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {optionList.map((option) => (
        <label
          key={option.id}
          className='flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm'
        >
          <input
            type='radio'
            name={`question-${question.id}`}
            className='h-4 w-4'
            checked={typeof value === 'string' ? value === option.value : false}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

const submitSurveyResponse = async (payload: SurveySubmissionPayload) => {
  await apiClient.post<unknown, SurveySubmissionPayload>(
    `/surveys/${encodeURIComponent(payload.surveyId)}/submit`,
    payload,
  )
}

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const rawSlug = String(params.slug ?? '')
  const surveySlug = useMemo(() => decodeSlug(rawSlug), [rawSlug])

  const [survey, setSurvey] = useState<SurveyViewModel | null>(null)
  const [answers, setAnswers] = useState<SurveyAnswerMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadSurvey = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<unknown>(
          `/surveys/${encodeURIComponent(surveySlug)}`,
          { cache: 'no-store' },
        )
        const mappedSurvey = mapSurveyResponse(response, surveySlug)

        if (!isMounted) {
          return
        }

        setSurvey(mappedSurvey)
        setAnswers({})
        setIsSubmitted(false)
        setSubmitError(null)
        setShowValidationErrors(false)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        const message =
          loadError instanceof ApiError
            ? loadError.message
            : loadError instanceof Error
              ? loadError.message
              : 'Unable to load survey.'

        setError(message)
        setSurvey(null)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (surveySlug.length > 0) {
      void loadSurvey()
    } else {
      setError('Survey slug is missing.')
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [surveySlug])

  const missingRequiredQuestionIds = useMemo(() => {
    if (!survey) {
      return new Set<string>()
    }

    return new Set(
      survey.questions
        .filter(
          (question) =>
            question.isRequired && !isAnswerProvided(question, answers[question.id]),
        )
        .map((question) => question.id),
    )
  }, [answers, survey])

  const canSubmit = missingRequiredQuestionIds.size === 0 && !isSubmitting && !isSubmitted

  const handleAnswerChange = (questionId: string, nextValue: SurveyAnswerValue) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: nextValue,
    }))
  }

  const handleSubmit = async () => {
    if (!survey) {
      return
    }

    setShowValidationErrors(true)
    setSubmitError(null)

    if (missingRequiredQuestionIds.size > 0) {
      return
    }

    const responses = buildSubmissionResponses(survey, answers)
    const payload: SurveySubmissionPayload = {
      surveyId: survey.id,
      surveySlug: survey.slug,
      responses,
      answers: responses,
      metadata: {
        source: 'survey-page',
        submittedAt: new Date().toISOString(),
      },
    }

    setIsSubmitting(true)

    try {
      await submitSurveyResponse(payload)
      setIsSubmitted(true)
    } catch (submissionError) {
      const message =
        submissionError instanceof ApiError
          ? submissionError.message
          : submissionError instanceof Error
            ? submissionError.message
            : 'Unable to submit survey response.'

      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#f5f5f5] p-6'>
        <div className='mx-auto max-w-3xl rounded-lg border border-dashed p-6 text-sm text-muted-foreground bg-white'>
          Loading survey...
        </div>
      </div>
    )
  }

  if (!survey || error) {
    return (
      <div className='min-h-screen bg-[#f5f5f5] p-6'>
        <div className='mx-auto max-w-3xl space-y-4'>
          <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
            {error ?? 'Unable to load survey.'}
          </div>
          <Button variant='outline' onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#f5f5f5] p-6'>
      <div className='mx-auto max-w-3xl space-y-4'>
        <Button variant='ghost' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Badge variant={survey.isActive ? 'default' : 'secondary'}>
                {survey.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant='outline'>{survey.slug}</Badge>
            </div>
            <CardTitle>{survey.title}</CardTitle>
            <CardDescription>
              Complete all required questions and submit your response.
            </CardDescription>
          </CardHeader>
        </Card>

        {survey.questions.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-sm text-muted-foreground'>
              No survey questions found.
            </CardContent>
          </Card>
        ) : (
          <>
            {survey.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className='pb-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <CardTitle className='text-base'>
                      {index + 1}. {question.questionText}
                    </CardTitle>
                    {question.isRequired ? (
                      <Badge variant='destructive'>Required</Badge>
                    ) : (
                      <Badge variant='outline'>Optional</Badge>
                    )}
                  </div>
                  <CardDescription>{question.questionType}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <SurveyQuestionField
                    question={question}
                    value={answers[question.id]}
                    onChange={(nextValue) =>
                      handleAnswerChange(question.id, nextValue)
                    }
                    disabled={isSubmitting || isSubmitted}
                  />
                  {showValidationErrors &&
                  missingRequiredQuestionIds.has(question.id) ? (
                    <p className='text-xs text-destructive'>
                      This required question must be answered.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardContent className='p-6 space-y-3'>
                {submitError ? (
                  <div className='rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                    {submitError}
                  </div>
                ) : null}
                {isSubmitted ? (
                  <div className='rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700'>
                    Survey submitted successfully.
                  </div>
                ) : null}
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-xs text-muted-foreground'>
                    {missingRequiredQuestionIds.size > 0
                      ? `${missingRequiredQuestionIds.size} required question(s) remaining`
                      : 'All required questions completed'}
                  </p>
                  <Button onClick={handleSubmit} disabled={!canSubmit}>
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
