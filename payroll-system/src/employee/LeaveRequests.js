import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Get the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Validation schema using Yup
const schema = Yup.object().shape({
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.date()
    .required("Start date is required")
    .nullable()
    .min(currentDate, "Start date cannot be in the past") // Ensure the start date is not before today
    .typeError("Start date must be a valid date"), // Ensure the value is a valid date
  endDate: Yup.date()
    .required("End date is required")
    .nullable()
    .typeError("End date must be a valid date") // Ensure the value is a valid date
    .test(
      "endDateAfterStartDate",
      "End date must be later than start date",
      function(value) {
        const { startDate } = this.parent; // Access startDate from the form
        if (!startDate || !value) return true; // Skip validation if any date is missing
        return new Date(value) > new Date(startDate); // Compare dates
      }
    ),
});

function LeaveRequests() {
  const [notification, setNotification] = useState("");  // For storing notification message
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = data => {
    // Prevent form submission if there are any errors (e.g., invalid dates)
    if (Object.keys(errors).length > 0) return;

    // Here you can trigger any actions (like submitting data to an API)
    alert("Leave request submitted!");
    console.log(data);

    // Set the notification
    setNotification("Your leave request has been successfully submitted.");

    // Reset form fields
    reset();
  };

  return (
    <div className="leave-requests">
      <h3>Submit Leave Request</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Leave Type</label>
          <input type="text" {...register("leaveType")} />
          <p>{errors.leaveType?.message}</p>
        </div>

        <div>
          <label>Start Date</label>
          <input type="date" {...register("startDate")} />
          <p>{errors.startDate?.message}</p>
        </div>

        <div>
          <label>End Date</label>
          <input type="date" {...register("endDate")} />
          <p>{errors.endDate?.message}</p>
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Show Notification */}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default LeaveRequests;