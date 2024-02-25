import { useEffect, useState } from "react";
import { Spinner, Stack } from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FetchBlackoutForTenantCalendar } from "@services/BlackoutApi";

export const BlackoutCalendar = () => {
  const [transformedBlackouts, setTransformedBlackouts] = useState([]);
  const [calendarBlackouts, setCalendarBlackouts] = useState(null);
  const [loading, setLoading] = useState(false);
  const localizer = momentLocalizer(moment);

  const fetchCalendarBlackouts = async () => {
    const response = await FetchBlackoutForTenantCalendar();
    if (response.ok) {
      const data = await response.json();
      setCalendarBlackouts(data);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchCalendarBlackouts();
    setLoading(false);
  }, []);

  useEffect(() => {
    const transformedArray = calendarBlackouts?.map((item) => ({
      title: item.name,
      start: item.start_date ? new Date(item.start_date) : null,
      end: item.end_date ? new Date(item.end_date) : null,
      allDay: false,
      resource: undefined,
    }));
    setTransformedBlackouts(transformedArray);
  }, [calendarBlackouts]);

  return (
    <>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <Stack>
          {transformedBlackouts && (
            <Calendar
              localizer={localizer}
              events={transformedBlackouts}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, width: "95%" }}
            />
          )}
        </Stack>
      )}
    </>
  );
};
