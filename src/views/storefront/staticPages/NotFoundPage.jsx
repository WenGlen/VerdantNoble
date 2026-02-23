
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {  

    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate('/',{replace: true});
        }, 3000);
    }, []);

    return (
        <>
            <div className="h-24"/>
            <div className="not-found-page">
                <h1>404 Not Found</h1>
            </div>
        </>
    );
}