import React from 'react';
import { LogsWrapper } from './styles';
import { DateTime } from 'luxon';

const logsData = [
  {
    id: 1,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 2,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 3,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 4,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 5,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 6,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 7,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  {
    id: 8,
    time: '2023-10-19T09:00:00.000Z', // Adjust the time to be in UTC format
    commentBy: 'User ID',
    activity: 'Assigned incident to NPF',
  },
  
  
];

export default function Logs() {
  const timeZone = 'Africa/Lagos'; // Define the desired time zone

  return (
    <LogsWrapper>
      <div className="contain">
        <div className="headers">
          <div className="col-5">
            <h5>Time</h5>
          </div>

          <div className="col">
            <h5>Incident Logs</h5>
          </div>
        </div>

        {logsData.map((logEntry) => (
          <div className="logged-item" key={logEntry.id}>
            <div className="col-5">
              
              <p className="time">
                {DateTime.fromISO(logEntry.time, { zone: timeZone }).toLocaleString(DateTime.TIME_WITH_SECONDS)}
              </p>
            </div>

            <div className="col">
              <p>
                <span className="user-id">@{logEntry.commentBy}</span> {logEntry.activity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </LogsWrapper>
  );
}
