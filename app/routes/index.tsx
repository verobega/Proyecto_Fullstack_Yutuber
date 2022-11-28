import { type ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import ytdl from 'ytdl-core';
import React, { type ChangeEvent, useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import MiniTable, { type Format } from './MiniTable';
import Header from '~/components/Header';

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
      <Header />
      <fetcher.Form method='post' className='rounded-xl shadow-xl flex'>
        <Input
          placeholder='Escribe tu link'
          value={url}
          name='url'
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
            setURL(value)
          }
        />
        <Button type='submit'>
          {fetcher.state === 'idle' ? (
            'Analizar'
          ) : (
            <div className='w-8 h-8 border-4 border-violet-900 border-t-violet-200 animate-spin rounded-full' />
          )}
        </Button>
      </fetcher.Form>
      {fetcher.data && (
        <MiniTable data={fetcher.data} onClick={handleDownload} />
      )}
    </section>
  );
}
