import { useEffect, useState } from "react";
import { Spinner, Stack } from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FetchReleaseForTenantCalendar } from "@services/ReleaseApi";

export const ReleaseCalendar = () => {
  const [transformedReleases, setTransformedReleases] = useState([]);
  const [calendarReleases, setCalendarReleases] = useState(null);
  const [loading, setLoading] = useState(false);
  const localizer = momentLocalizer(moment);

  const fetchCalendarRelease = async () => {
    const response = await FetchReleaseForTenantCalendar();
    if (response.ok) {
      const data = await response.json();
      setCalendarReleases(data);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchCalendarRelease();
    setLoading(false);
  }, []);

  useEffect(() => {
    const transformedArray = calendarReleases?.map((item) => ({
      title: item.name,
      start: item.start_date ? new Date(item.start_date) : null,
      end: item.end_date ? new Date(item.end_date) : null,
      allDay: false,
      resource: undefined,
    }));
    setTransformedReleases(transformedArray);
  }, [calendarReleases]);

  return (
    <>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <Stack>
          {transformedReleases && (
            <Calendar
              localizer={localizer}
              events={transformedReleases}
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
