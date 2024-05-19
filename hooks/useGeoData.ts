import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/AuthContext';

const useGeoData = () => {
  const [geoData, setGeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchGeoData = async () => {
      if (!isLoggedIn) {
        setError('User is not logged in');
        setLoading(false);
        return;
      }

      const token = Cookies.get('accessToken');
      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/proxy?path=api/geodata', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setGeoData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch geo data');
        }
      } catch (err) {
        setError('Failed to fetch geo data');
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, [isLoggedIn]);

  return { geoData, loading, error };
};

export default useGeoData;
