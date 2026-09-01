# Acme Leave Manager — Admin Guide

This app tracks: Employee, LeaveRequest.

## Who can do what

- **employee** can: create LeaveRequest own; read LeaveRequest own
- **manager** can: read LeaveRequest team; update LeaveRequest.status team
- **hr** can: read LeaveRequest all; update LeaveRequest.status all

## How things flow

- **submit leave request** starts when employee submits request. Approvals are needed from: manager, hr.

## Getting help

This app was built with Floe. If something looks wrong or you want to change
how it works, go back to Floe and request an update rather than editing the
generated code directly.
