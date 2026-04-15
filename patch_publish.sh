sed -i '155,160c\
  const handleSchedulePost = (dayOrEvent?: number | React.MouseEvent) => {\
    const day = typeof dayOrEvent === "number" ? dayOrEvent : undefined;' src/pages/Publish.tsx
