import { type LoaderFunction } from '@remix-run/node';
import ytdl from 'ytdl-core';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const link = url.searchParams.get('url') as string;
  const itag = url.searchParams.get('itag') as string;
  // name
  const stream = ytdl(link, {
    filter: (format) => format.itag === Number(itag),
  });
  return new Response(stream, {
    headers: {
      'Content-Disposition': `attachment; filename="video.mp4"`, // nombre dependa del formato tip: 
    },
  });
};
