import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid'

const MusicPlayer = () => {
const [IsPlaying, setIsplaying] = useState(false);
const intervalRef = useRef();
const Music = useRef(null);

const HandlePlay = () => {
    setTimeout(() => {
            Music.current.play();
    }, 250);
};

const HandlePause = () => {
        Music.current.pause();
        setIsplaying(false);
};



useEffect(() => {
    if(!IsPlaying) {
        Music.current = new Audio(`/assets/music/m.wav`);
    }
}, [IsPlaying, intervalRef]);





    return (
        <div className='absolute flex justify-center items-center w-[80px] h-[80px] bottom-4 right-9 sm:left-auto sm:right-9 border border-black p-3 rounded-md z-50'>

            {IsPlaying ? (
                <div className='flex justify-center items-center cursor-pointer transition-all ease-in-out animate-spin' onClick={(e) => {
                    e.preventDefault();
                    setIsplaying(false);
                    HandlePause();
                }}>
                <PauseCircleIcon className='w-10 h-10'/>
                </div>
            ) : (
                <div className='flex justify-center items-center cursor-pointer hover:scale-125 transition-all ease-in-out' onClick={(e) => {
                    e.preventDefault();
                    setIsplaying(true);
                    HandlePlay();
                }}>
                <PlayCircleIcon className='w-10 h-10'/>
                </div>
            )}
        </div>
    );
}

export default MusicPlayer;