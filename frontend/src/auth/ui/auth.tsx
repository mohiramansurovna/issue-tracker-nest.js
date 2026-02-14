import {Outlet, useLocation} from 'react-router';
export default function Auth() {
    const location = useLocation();
    return (
        <section
            className='flex justify-between items-center h-[calc(100dvh-55px)] w-full overflow-hidden'
            style={{backgroundImage: "url('/auth.jpg')", backgroundSize: 'cover'}}>
            {location.pathname === '/login' && <div className='w-2/3 animate-slide-in-left'></div>}

            <div
                className={`bg-background h-full w-1/3 ${
                    location.pathname === '/login'
                        ? 'animate-slide-in-right'
                        : 'animate-slide-in-left'
                }`}>
                <Outlet />
            </div>

            {location.pathname === '/register'&&<div className='w-2/3 animate-slide-in-right'></div>}
        </section>
    );
}
