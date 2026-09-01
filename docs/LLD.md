# Acme Leave Manager — Low-Level Design

## Entity schema

### Employee

| Field | Type | Required | Default |
|---|---|---|---|
| full_name | string | yes |  |
| email | string | yes |  |
| leave_balance_days | number | no | 20 |

### LeaveRequest

| Field | Type | Required | Default |
|---|---|---|---|
| employee_id | ref:Employee | yes |  |
| start_date | date | yes |  |
| end_date | date | yes |  |
| reason_text | text | no |  |
| status | enum | no |  |


## Relationships

- LeaveRequest.employee_id -> Employee (many-to-one)

## Workflow detail

### submit leave request

Triggered when: employee submits request

- **validate balance** (`s1`) — Automatic
- **interpret free text reason** (`s2`) — Automatic (AI-powered)
- **manager approval** (`s3`) — Needs someone to approve
- **hr escalation approval** (`s3_escalate`) — Needs someone to approve
- **apply decision** (`s4`) — Automatic

