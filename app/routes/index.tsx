import { type ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import ytdl from 'ytdl-core';
import { useState } from 'react';

type Format = {
  url: string;
  itag: number;
};

interface FetcherData {
  title: string;
  thumbnail: string;
  duration: number;
  formats: Format[];
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = formData.get('url') as string;
  if (!url) return null;

  const info = await ytdl.getInfo(url);
  const result = {
    title: info.videoDetails.title,
    thumbnail:
      info.videoDetails?.thumbnails[info.videoDetails?.thumbnails.length - 1]
        ?.url,
    duration: info.videoDetails?.lengthSeconds,
    formats: info.formats.filter((f) => f.hasAudio && f.hasVideo),
  };
  return result;
};

export default function Thumb() {
  const fetcher = useFetcher<FetcherData | null>();
  const [url, setURL] = useState('https://youtu.be/lV61TDHiALo');

  const handleDownload = (format: Format) => {
    window.open(
      '/download?url=' + url + '&itag=' + format.itag,
      'targetWindow'
    );
  };

  return (
    <section className='bg-violet-200 text-violet-800 h-screen flex flex-col gap-8 items-center py-20'>
      <div className='flex items-center'>
        <img className='w-[150px]' src='youtube.png' alt='yutu' />
        <h2 className='text-6xl uppercase font-medium tracking-wider'>
          Yutuber
        </h2>
      </div>
      <fetcher.Form method='post' className='rounded-xl shadow-xl flex'>
        <input
          onChange={({ target: { value } }) => setURL(value)}
          value={url}
          name='url'
          className='rounded-l-xl text-xl p-4 bg-violet-50 w-96 outline-violet-500'
          type='text'
          placeholder='Escribe tu link'
        />
        <button className='text-violet-100 bg-violet-500 text-xl p-4 rounded-r-xl hover:bg-violet-700 transition-all'>
          {fetcher.state === 'idle' ? (
            'Analizar'
          ) : (
            <div className='w-8 h-8 border-4 border-violet-900 border-t-violet-200 animate-spin rounded-full' />
          )}
        </button>
      </fetcher.Form>
      {fetcher.data && (
        <article className='bg-violet-200 flex items-start'>
          <div className='w-[50%]'>
            <img
              className='w-80'
              src={fetcher.data.thumbnail}
              alt='thumbnail'
            />
            <h2 className='text-lg font-semibold'>{fetcher.data.title}</h2>
            <p>
              Duración: {Math.floor((fetcher.data.duration / 0x3c) % 0x3c)} min{' '}
              {Math.round(fetcher.data.duration % 0x3c)} seg
            </p>
          </div>
          <div className=''>
            <h2>Descarga el video como:</h2>
            {fetcher.data.formats?.map((f, i) => (
              <div key={i} className='flex'>
                <p className='p-4 border border-violet-500 w-32'>
                  {f.qualityLabel}.{f.container}
                </p>
                <button
                  onClick={() => handleDownload(f)}
                  className='p-4 border border-violet-500 w-32 rounded bg-violet-300'
                >
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
