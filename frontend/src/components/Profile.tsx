import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  console.log(profileData) ;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Profile</Typography>
        <Typography variant="body1">Gender: {profileData.gender}</Typography>
        <Typography variant="body1">Sexual Preferences: {profileData.sexualPreferences?.join(', ')}</Typography>
        <Typography variant="body1">Biography: {profileData.biography}</Typography>
        <Typography variant="body1">Interests: {profileData.interests?.join(', ')}</Typography>
      </CardContent>
    </Card>
  );
};

export default Profile;
