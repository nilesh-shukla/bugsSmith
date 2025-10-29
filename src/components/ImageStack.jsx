import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function ImageStack({className}) {
    const [images, setImages] = useState([
        '/StackImage/stackImg-1.png',
        '/StackImage/stackImg-2.png',
        '/StackImage/stackImg-3.png',
        '/StackImage/stackImg-4.png'
    ]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAutoPlay, setAutoPlay] = useState(true);

    const rotateImages = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        
        setTimeout(() => {
            setImages(prevImages => {
                const newImages = [...prevImages];
                const firstImage = newImages.shift();
                newImages.push(firstImage);
                return newImages;
            });
        }, 3000);

        setTimeout(() => {
            setIsAnimating(false);
        }, 3000);
    };

    useEffect(() => {
        let intervalId;
        if(isAutoPlay && !isAnimating){
            intervalId = setInterval(rotateImages, 2000);
        }
        return () => clearInterval(intervalId);
    }, [isAutoPlay, isAnimating]);

    return (
        <div className={`relative w-full h-full md:overflow-x-hidden overflow-x-auto scrollbar-hide ${className}`}>
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-500
                        ${isAnimating && index === 0 ? 'animate-slideOut' : ''}
                        ${isAnimating && index === 1 ? 'animate-slideIn' : ''}`}
                    style={{
                        transform: `translateX(${index * 10}px) translateY(${index * 20}px) rotate(${index * 2}deg)`,
                        zIndex: isAnimating && index === 0 ? 0 : images.length - index,
                        opacity: isAnimating && index === 0 ? 0 : 1
                    }}>
                    <img 
                        src={img} 
                        alt={`Stack image ${index+1}`}
                        className='w-full h-full object-cover rounded-lg shadow-lg'
                    />
                </div>
            ))}
        </div>
    )
}

export default ImageStack