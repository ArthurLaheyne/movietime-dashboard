import { fetchMoviesLiked } from "@/app/lib/data";
import { MovieLiked } from '@/app/lib/definitions';
import { formatDateToLocal } from '@/app/lib/utils';
import MovieLink from "./MovieLink";

export default async function LikedsTable() {
  const likeds = await fetchMoviesLiked();

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
              {likeds?.map((liked: MovieLiked) => (
                <tr
                  key={liked.datetime}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {liked.user}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <MovieLink movie={liked.movie}/>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(liked.datetime)}
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