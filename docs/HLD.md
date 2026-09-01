# Acme Leave Manager — High-Level Design

Generated from IR version 1.0 (domain: leave-management).

## Entities

- **Employee** (3 fields)
- **LeaveRequest** (5 fields)

## Roles

- **employee** — create:LeaveRequest own, read:LeaveRequest own
- **manager** — read:LeaveRequest team, update:LeaveRequest.status team
- **hr** — read:LeaveRequest all, update:LeaveRequest.status all

## Workflows

- submit leave request

## Deployment

- Target: cloud
- Expected scale: medium
- Reliability: standard
- Budget band: moderate

## Integrations

- email: notify manager and employee on status change
