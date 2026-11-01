import type { LeaveFormData, WFHFormData, ValidationErrors } from '../types/leave'

export function validateLeaveForm(data: Partial<LeaveFormData>): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.dateFrom) {
    errors.dateFrom = 'Start date is required'
  }

  if (!data.dateTo) {
    errors.dateTo = 'End date is required'
  } else if (data.dateFrom && data.dateTo < data.dateFrom) {
    errors.dateTo = 'End date cannot be before start date'
  }

  if (!data.reason?.trim()) {
    errors.reason = 'Reason is required'
  } else if (data.reason.trim().length < 10) {
    errors.reason = 'Please provide a more detailed reason (at least 10 characters)'
  }

  if (!data.leaveType) {
    errors.leaveType = 'Please select a leave type'
  }

  if (!data.projectName?.trim()) {
    errors.projectName = 'Project name is required'
  }

  if (!data.name?.trim()) {
    errors.name = 'Your name is required'
  }

  return errors
}

export function validateWFHForm(data: Partial<WFHFormData>): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.dateFrom) {
    errors.dateFrom = 'Start date is required'
  }

  if (!data.dateTo) {
    errors.dateTo = 'End date is required'
  } else if (data.dateFrom && data.dateTo < data.dateFrom) {
    errors.dateTo = 'End date cannot be before start date'
  }

  if (!data.reason?.trim()) {
    errors.reason = 'Reason is required'
  } else if (data.reason.trim().length < 10) {
    errors.reason = 'Please provide a more detailed reason (at least 10 characters)'
  }

  if (!data.projectName?.trim()) {
    errors.projectName = 'Project name is required'
  }

  if (!data.name?.trim()) {
    errors.name = 'Your name is required'
  }

  return errors
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((v) => v !== undefined)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getTodayString(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}
