export type RequestType = 'leave' | 'wfh'

export type LeaveType =
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Earned Leave'
  | 'Emergency Leave'
  | 'Other'

export type Salutation =
  | 'Dear Manager'
  | 'Hello Team'
  | 'Hello Ma\'am'
  | 'Hello Sir'

export interface LeaveFormData {
  dateFrom: string
  dateTo: string
  reason: string
  leaveType: LeaveType
  projectName: string
  name: string
  salutation: Salutation
}

export interface WFHFormData {
  dateFrom: string
  dateTo: string
  reason: string
  projectName: string
  additionalNotes?: string
  name: string
  salutation: Salutation
}

export interface GenerateEmailRequest {
  request_type: RequestType
  date_from: string
  date_to: string
  reason: string
  leave_type?: string
  project_name: string
  additional_notes?: string
  name: string
  salutation: string
}

export interface GenerateEmailResponse {
  success: boolean
  subject: string
  email_body: string
  error?: string
}

export interface ValidationErrors {
  dateFrom?: string
  dateTo?: string
  reason?: string
  leaveType?: string
  projectName?: string
  name?: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
