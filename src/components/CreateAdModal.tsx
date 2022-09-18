import { Input } from '../components/Form/Input';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController, CaretDown, CaretUp } from 'phosphor-react';
import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Game {
    id: string;
    title: string;
}

export function CreateAdModal() {

    const [games, setGames] = useState<Game[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [selectedGame, setselectedGame] = useState('');
    const [useVoiceChannel, setUseVoiceChannel] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3333/games')
            .then(response => {
                setGames(response.data)
            })

    }, [])


    async function handleCreateAd(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        

        if (!selectedGame || weekDays.length === 0 || !data.discord || !data.yearsPlaying || !data.hourStart || !data.hourEnd) {
            toast.warning("Preencha todos os campos!");
            return;
        } 

        try {
            await axios.post(`http://localhost:3333/games/${selectedGame}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChannel
            }).then(() => {
                toast.success("Anúncio criado com sucesso!");
                setTimeout(() => {
                    location.reload();
                }, 2000)
            })


        }
        catch(err) {
            toast.error("Erro ao criar o anúncio!");
            console.log(err);
        }
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed' />

            <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
                <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

                <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold' htmlFor='game'>Qual o game?</label>
                        <Select.Root onValueChange={setselectedGame} value={selectedGame} >
                            <Select.Trigger
                                aria-label='game'
                                className={`flex justify-between items-center bg-zinc-900 py-3 px-4 rounded text-sm ${selectedGame !== '' ? 'text-white' : 'text-zinc-500'}`}
                            >
                                <Select.Value placeholder="Selecione um game" />
                                <Select.Icon>
                                    <CaretDown size={24} className="text-zinc-400" />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                                <Select.Content className='bg-zinc-900 rounded overflow-hidden'>
                                    <Select.ScrollUpButton className='flex items-center justify-center h-6'>
                                        <CaretUp size={24} className="text-zinc-400" />
                                    </Select.ScrollUpButton>
                                    <Select.Viewport className='py-2 px-1'>
                                        <Select.Group>
                                            {games.map(game => {
                                                return (
                                                    <Select.Item key={game.id} value={game.id} className='flex items-center justify-between py-2 px-3 m-1 bg-zinc-900 text-zinc-500 cursor-pointer rounded hover:bg-zinc-800 hover:text-white'>
                                                        <Select.ItemText>{game.title}</Select.ItemText>
                                                        <Select.ItemIndicator className='ml-4'>
                                                            <Check size={24} className='text-emerald-600' />
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                )
                                            })}
                                        </Select.Group>
                                    </Select.Viewport>
                                    <Select.ScrollDownButton className='flex items-center justify-center h-6'>
                                        <CaretDown size={24} className="text-zinc-400" />
                                    </Select.ScrollDownButton>
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold' htmlFor='name'>Seu nome (ou nickname)</label>
                        <Input name="name" id='game' placeholder='Como te chamam dentro do game?' />
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-semibold' htmlFor='yearsPlaying'>Joga há quantos anos?</label>
                            <Input name="yearsPlaying" id='yearsPlaying' type='number' placeholder='Tudo bem ser ZERO' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-semibold' htmlFor='discord'>Qual seu Discord?</label>
                            <Input name="discord" id='discord' type='text' placeholder='Usuario#0000' />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-semibold' htmlFor='weekDays'>Quando costuma jogar?</label>

                            <ToggleGroup.Root type="multiple" className='grid grid-cols-4 gap-2' onValueChange={setWeekDays}>
                                <ToggleGroup.Item
                                    value='0'
                                    title='Domingo'
                                    className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    D
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='1'
                                    title='Segunda'
                                    className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    S
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='2'
                                    title='Terça'
                                    className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    T
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='3'
                                    title='Quarta'
                                    className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    Q
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='4'
                                    title='Quinta'
                                    className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    Q
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='5'
                                    title='Sexta'
                                    className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    S
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value='6'
                                    title='Sábado'
                                    className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                >
                                    S
                                </ToggleGroup.Item>
                            </ToggleGroup.Root>
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label className='font-semibold' htmlFor='hourStart'>Qual o horário do dia?</label>
                            <div className='grid grid-cols-2 gap-2'>
                                <Input name="hourStart" id='hourStart' type='time' placeholder='De' />
                                <Input name="hourEnd" id='hourEnd' type='time' placeholder='Até' />
                            </div>
                        </div>
                    </div>

                    <label className='mt-2 flex gap-2 items-center text-sm'>
                        <Checkbox.Root onCheckedChange={(checked) => setUseVoiceChannel(checked === true ? true : false)} className='w-6 h-6 p-1 rounded bg-zinc-900'>
                            <Checkbox.Indicator>
                                <Check className='w-4 h-4 text-emerald-400' />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        Costumo me conectar ao chat de voz
                    </label>

                    <footer className='mt-4 flex justify-end gap-4'>
                        <Dialog.Close
                            type='button'
                            className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                        >
                            Cancelar
                        </Dialog.Close>
                        <button type='submit' className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'>
                            <GameController size={24} />
                            Encontrar duo
                        </button>
                    </footer>
                </form>
                <ToastContainer autoClose={3000} />
            </Dialog.Content>
        </Dialog.Portal >
    )
}