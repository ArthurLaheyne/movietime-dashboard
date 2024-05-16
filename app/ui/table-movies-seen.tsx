import { fetchLogs } from "@/app/lib/data";
import { Logs } from '@/app/lib/definitions';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function TableMoviesSeen() {
  const logs = await fetchLogs();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Movie
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {logs?.map((log: Logs) => (
                <tr
                  key={log.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {log.user}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {log.action}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(log.datetime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}