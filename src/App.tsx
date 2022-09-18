import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'
import './styles/main.css';

import logoImg from './assets/logo-nlw-esports.svg';

import { GameBanner } from './components/GameBanner/GameBanner';
import { CreateAdBanner } from './components/CreateAdBanner';
import { CreateAdModal } from './components/CreateAdModal';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import axios from 'axios';


interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  
  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])

  const sliderOptions = {
    loop: true,
    slides: {
      perView: 6.5,
      spacing: 24
    }
  }
  
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(sliderOptions);

  useEffect(() => {
    instanceRef.current?.update({
      ...sliderOptions
    });
  }, [instanceRef, sliderOptions]);
  

  return (
    <div className='max-w-5xl mx-auto flex flex-col items-center my-20'>
        <img src={logoImg} alt="" />

        <h1 className='text-6xl text-white font-black mt-20'>
          Seu <span className='text-transparent bg-nlw-gradient bg-clip-text'>duo</span> está aqui.
        </h1>

        <div ref={sliderRef} className="keen-slider mt-16">
          { games.sort((g1, g2) => g1._count.ads - g2._count.ads).reverse().map((game, index) => {
              return (
                <GameBanner 
                  key={game.id}
                  slideNum={index}
                  bannerUrl={game.bannerUrl} 
                  title={game.title} 
                  adsCount={game._count.ads}
                />
              )
          }) }
        </div>

        <Dialog.Root>
          <CreateAdBanner />

          <CreateAdModal />
        </Dialog.Root>
    </div>
  )
}

export default App
