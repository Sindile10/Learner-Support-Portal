# Changelog

## 2026-08-20 - UI Design
The first USER UI Design was changed after we decided to use Figma instead of Canva. The new design is more interactive and allows for better collaboration. This is the first UI Design: https://www.canva.com/design/DAHRVBIphZs/t2B3UGSVR68YxBamsK2VyQ/edit 


## 2026-08-31 - Fixes
Added user stories for learner + assessor PoV. Auth, tasks CRUD, bookings, progress.
Added use cases Manage Tasks, Book Support, View Progress with main flow, alt, fail, assessor view.
Added trace table: empty email, invalid email, short pass, valid register, progress calc (2/3)*100=66%, overdue. 

Formula: progress = (completed/total)*100, totalHours = reduce(), outstanding = total-completed. Handles total=0.

## 2026-08-31 - Core CRUD
POST GET PATCH DELETE tasks, bookings status pending->approved, filter() sort() reduce(), window.print()

