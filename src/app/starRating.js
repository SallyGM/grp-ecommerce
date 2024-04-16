import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';

const StarRating = ({ rating }) => {
    // Round the rating to the nearest half star
    const roundedRating = Math.round(rating * 2) / 2;
    const allStars = 5;

    // Array to store the StarIcon components
    const stars = [];

    // Iterate to create StarIcon components based on the rounded rating
    for (let i = 0; i < roundedRating; i++) {
    
        stars.push(<StarIcon key={i} style={{ color: 'gold' }} />);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {stars}
        </div>
    );
}


export default StarRating;
