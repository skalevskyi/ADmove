type TrajetsProofDay = {
  isRecorded: boolean;
};

export type GpsRecordStatusLabels = {
  recorded: string;
  notRecorded: string;
};

export function shouldShowGpsRouteTrace(day: TrajetsProofDay): boolean {
  return day.isRecorded;
}

export function shouldShowGpsMetrics(day: TrajetsProofDay): boolean {
  return day.isRecorded;
}

export function getGpsRecordStatusText(
  day: TrajetsProofDay,
  labels: GpsRecordStatusLabels,
): string {
  return day.isRecorded ? labels.recorded : labels.notRecorded;
}
