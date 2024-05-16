'use client'

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Logs } from "@/app/lib/definitions";

export default function BasicBars({
  logs,
}: {
  logs: Logs[];
}) {

  const end = new Date()
  // ex : il est 9h30, start sera hier à 10h00
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  start.setHours(start.getHours() + 1)
  start.setMinutes(0)
  start.setSeconds(0)
  
  // Retourn la liste des entiers correspondants aux 24 dernières heures
  const getLast24Hours = (end: Date): number[] => {
    const hours = []
    for (let index = 0; index <= 23; index++) {
      let hour = new Date(end.getTime() - (index * 60 * 60 * 1000))
      let hourr = hour.getHours()
      hours.push(hourr)
    }
    return hours.reverse()
  }

  const last24Hours = getLast24Hours(end)

  const countLogsByHour = (hours: number[], end: Date, start: Date): number[] => {
    // Suppression des logs en dehors du graphique
    const logs_interval = logs.filter( (log) => {
      const log_datetime = new Date(log.datetime)
      return log_datetime > start && log_datetime < end
    })
    // Récupération des heures des logs
    const logs_hours = logs_interval.map( (log_interval) => {
      return (new Date(log_interval.datetime)).getHours()
    })
    // Addition des heures
    let aggregate = hours.map( (hour) => {
      return logs_hours.filter((x) => x == hour).length
    })
    return aggregate
  }

  const count = countLogsByHour(last24Hours, end, start)

  return (
    <BarChart
      xAxis={[{
        scaleType: 'band',
        data: last24Hours
      }]}
      yAxis={[{ 
        max: 20,
      }]}
      borderRadius={5}
      series={[{ data: count, color: '#dbbc00' }]}
      height={300}
    />
  );
}