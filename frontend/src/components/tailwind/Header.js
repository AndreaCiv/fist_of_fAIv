import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import '../../css/input.css';
import logo from '../../logo.png';


export default function Header() {
  return (
                <div className="grid justify-items-center bg-sky-950 h-[8rem]">
                  <img
                    className="h-[7rem] w-auto p-3"
                    src={logo}
                    alt="Your Company"
                  ></img>
                  </div>
  );
}
