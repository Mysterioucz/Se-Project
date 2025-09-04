'use client'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import QuantitySelector from './quantity_selector';
import '../app/globals.css'
import { useState } from 'react';

export default function Flight_Search_Bar() {
    
    const [isFlightClicked, setFlightClicked] = useState(false);
    const [isClassClicked, setClassClicked] = useState(false);

    const [isLeaveClicked, setLeaveClicked] = useState(false);
    const [isGoClicked, setGoClicked] = useState(false);
    const [isDepartReturnClicked, setDepartReturnClicked] = useState(false);
    const [isPassengersClicked, setPassengersClicked] = useState(false);

    return (
        <div className="w-full mx-auto --font-sans">
            <div className="bg-[#30A2C5] text-white p-4 rounded-t-sm mt-4">
                <h2 className="text-2xl font-semibold">Select flight informations</h2>
            </div>

            <div className="bg-white p-4 rounded-b-lg border-x-5 border-b-5 border-[#30A2C5]">
                <div className="flex flex-wrap items-center gap-10 mb-2 ml-5">
                    {/* Flight type */}
                    <div className="relative">
                        <button className="flex items-center text-[#022b39] --color-primary-900 font-medium"
                        onClick={() => {
                            setFlightClicked(! isFlightClicked);
                            if (isClassClicked) {
                                setClassClicked(! isClassClicked);
                            }
                            if (isLeaveClicked) {
                                setLeaveClicked(! isLeaveClicked);
                            }
                            if (isGoClicked) {
                                setGoClicked(! isGoClicked);
                            }
                            if (isDepartReturnClicked) {
                                setDepartReturnClicked(! isDepartReturnClicked);
                            }
                            if (isPassengersClicked) {
                                setPassengersClicked(! isPassengersClicked);
                            }
                        }}
                        >
                            <span>Flight type</span>
                            <ArrowDropDown />
                        </button>
                        {isFlightClicked && (
                            <ul className="absolute mt-2 w-40 bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Round trip</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">One way</li>
                            </ul>
                        )}
                    </div>
                    
                    {/* Class type */}
                    <div className="relative group">
                        <button className="flex items-center text-[#022b39] --color-primary-900 font-medium"
                        onClick={() => {
                            setClassClicked(! isClassClicked);
                            if (isFlightClicked) {
                                setFlightClicked(! isFlightClicked);
                            }
                            if (isLeaveClicked) {
                                setLeaveClicked(! isLeaveClicked);
                            }
                            if (isGoClicked) {
                                setGoClicked(! isGoClicked);
                            }
                            if (isDepartReturnClicked) {
                                setDepartReturnClicked(! isDepartReturnClicked);
                            }
                            if (isPassengersClicked) {
                                setPassengersClicked(! isPassengersClicked);
                            }
                        }}
                        >
                            <span>Class type</span>
                            <ArrowDropDown />
                        </button>
                        <div>
                            {isClassClicked && (
                                <ul className="absolute mt-2 w-40 bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Economy</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Premium Economy</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Business</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">First</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>


                <div className="flex flex-row gap-2 mt-3">
                    
                    {/* Leave */}
                    <div className='relative flex flex-row w-full'>
                        <button 
                        className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
                        onClick={() => {
                            setLeaveClicked(! isLeaveClicked);
                            if (isClassClicked) {
                                setClassClicked(! isClassClicked);
                            }
                            if (isFlightClicked) {
                                setLeaveClicked(! isFlightClicked);
                            }
                            if (isGoClicked) {
                                setGoClicked(! isGoClicked);
                            }
                            if (isDepartReturnClicked) {
                                setDepartReturnClicked(! isDepartReturnClicked);
                            }
                            if (isPassengersClicked) {
                                setPassengersClicked(! isPassengersClicked);
                            }
                        }}
                        >
                            
                            <div className="flex items-center">
                                <FlightTakeoffIcon className="mr-2" />
                                <span>Leaving From?</span>
                            </div>
                            { ! isLeaveClicked && (<ArrowDropDown className='mr-2' />) }
                            { isLeaveClicked && (<ArrowDropUpIcon className='mr-2' />) }
                        </button>
                        {isLeaveClicked && (
                            <ul className="absolute mt-2 max-h-50 w-full bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test1</li> 
                                {/* add set value in the onclick event (store state of value selected too and chaneg the span to {selected value}) */}
                                {/* will fix later when fetch api */}
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test2</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test3</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test4</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test5</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test6</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test7</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setLeaveClicked(false);}}>test8</li> 
                            </ul>
                        )}
                    </div>

                    {/* Going to */}
                    <div className='relative flex flex-row w-full'>
                        <button className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
                        onClick={() => {
                                setGoClicked(! isGoClicked);
                                if (isClassClicked) {
                                    setClassClicked(! isClassClicked);
                                }
                                if (isLeaveClicked) {
                                    setLeaveClicked(! isLeaveClicked);
                                }
                                if (isFlightClicked) {
                                    setFlightClicked(! isFlightClicked);
                                }
                                if (isDepartReturnClicked) {
                                    setDepartReturnClicked(! isDepartReturnClicked);
                                }
                                if (isPassengersClicked) {
                                    setPassengersClicked(! isPassengersClicked);
                                }
                            }}
                        >

                        <div className="flex items-center">
                            <FlightLandIcon className="mr-2" />
                            <span>Going to?</span>
                        </div>
                        { ! isGoClicked && (<ArrowDropDown className='mr-2' />) }
                        { isGoClicked && (<ArrowDropUpIcon className='mr-2' />) }
                    </button>
                    {isGoClicked && (
                        <ul className="absolute mt-2 max-h-50 w-full bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test1</li> 
                            {/* add set value in the onclick event (store state of value selected too and chaneg the span to {selected value}) */}
                            {/* will fix later when fetch api */}
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test2</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test3</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test4</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test5</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test6</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test7</li> 
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setGoClicked(false);}}>test8</li> 
                        </ul>
                    )}
                    </div>
                    
                    
                    {/* Depart - Return */}
                    <div className='relative flex flex-row w-full'>
                        <button className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
                        onClick={() => {
                                setDepartReturnClicked(! isDepartReturnClicked);
                                if (isClassClicked) {
                                    setClassClicked(! isClassClicked);
                                }
                                if (isLeaveClicked) {
                                    setLeaveClicked(! isLeaveClicked);
                                }
                                if (isGoClicked) {
                                    setGoClicked(! isGoClicked);
                                }
                                if (isFlightClicked) {
                                    setFlightClicked(! isFlightClicked);
                                }
                                if (isPassengersClicked) {
                                    setPassengersClicked(! isPassengersClicked);
                                }
                            }}>
                            
                            <div className="flex items-center">
                                <CalendarTodayIcon className="mr-2" />
                                <span>Depart - Return</span>
                            </div>
                            { ! isDepartReturnClicked && (<ArrowDropDown className='mr-2' />) }
                            { isDepartReturnClicked && (<ArrowDropUpIcon className='mr-2' />) }
                        </button>
                        {isDepartReturnClicked && (
                            <div className="absolute mt-2 w-full bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                <QuantitySelector label="Adults" description="12+ years old" init={1} />
                                <QuantitySelector label="Children" description="2 - 11 years old" init={1} />
                                <QuantitySelector label="Infants" description="Under 2 years old" init={0} />
                            </div>
                        )}
                    </div>
                    
                    
                    {/* passengers */}
                    <div className='relative flex flex-row w-full'>
                        <button className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
                        onClick={() => {
                            setPassengersClicked(! isPassengersClicked);
                            if (isClassClicked) {
                                setClassClicked(! isClassClicked);
                            }
                            if (isLeaveClicked) {
                                setLeaveClicked(! isLeaveClicked);
                            }
                            if (isGoClicked) {
                                setGoClicked(! isGoClicked);
                            }
                            if (isFlightClicked) {
                                setFlightClicked(! isFlightClicked);
                            }
                            if (isDepartReturnClicked) {
                                setDepartReturnClicked(! isDepartReturnClicked);
                            }
                        }}>
                        
                            <div className="flex items-center">
                                <PersonIcon className="mr-2" />
                                <span>passengers</span>
                            </div>
                            { ! isPassengersClicked && (<ArrowDropDown className='mr-2' />) }
                            { isPassengersClicked && (<ArrowDropUpIcon className='mr-2' />) }
                        </button>
                        {isPassengersClicked && (
                            <ul className="absolute mt-2 max-h-50 w-full bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test1</li> 
                                {/* add set value in the onclick event (store state of value selected too and chaneg the span to {selected value}) */}
                                {/* will fix later when fetch api */}
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test2</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test3</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test4</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test5</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test6</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test7</li> 
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {setPassengersClicked(false);}}>test8</li> 
                            </ul>
                        )}
                    </div>
                    

                    {/* Search */}
                    <button className="relative flex items-center text-white bg-[#30A2C5] rounded-sm py-2 border-2 border-[#30A2C5] pl-10 pr-10 --font-sans hover:bg-[#067399]">
                        Search
                    </button>
                </div>
            </div>

            
            
        </div>
    );
}