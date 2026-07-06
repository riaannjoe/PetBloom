export interface MapPlace {
  id: string;
  name: string;
  address: string;
  distance: string; // e.g. "1.2 miles"
  rating: number;
  phone: string;
  isOpenNow: boolean;
  type: 'VETERINARIAN' | 'PARK' | 'HOSPITAL';
}

export const mapsService = {
  async getNearbyPlaces(type: 'VETERINARIAN' | 'PARK' | 'HOSPITAL', _zipOrCoords?: string): Promise<MapPlace[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (type === 'VETERINARIAN' || type === 'HOSPITAL') {
      return [
        {
          id: 'place-1',
          name: 'Green Valley Animal Hospital',
          address: '1420 Meadow Lane, Green Valley',
          distance: '1.2 miles',
          rating: 4.8,
          phone: '(555) 123-4567',
          isOpenNow: true,
          type: 'VETERINARIAN',
        },
        {
          id: 'place-2',
          name: 'Emergency Vet Care 24/7',
          address: '890 Parkway Blvd, Central City',
          distance: '4.5 miles',
          rating: 4.6,
          phone: '(555) 999-8888',
          isOpenNow: true,
          type: 'HOSPITAL',
        },
      ];
    }

    return [
      {
        id: 'place-3',
        name: 'Oak Creek Off-Leash Dog Park',
        address: '400 Pine Dr, Oak Creek',
        distance: '2.1 miles',
        rating: 4.7,
        phone: 'N/A',
        isOpenNow: true,
        type: 'PARK',
      },
    ];
  },
};
