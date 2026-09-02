import { Itinerary } from '../types';

export const SAMPLE_ITINERARIES: Itinerary[] = [
  {
    id: 'australian-wonders',
    title: 'Australian Wonders',
    subtitle: 'Harbor lights, coral wonders & ancient rainforests',
    dateRange: 'NOV 12 — NOV 22 • 2 Travelers',
    travelersCount: 2,
    destination: 'Sydney & Cairns, Australia',
    regionCountry: 'Australia',
    isChinaRegion: false,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjeRw8495g7sWRuL0w1I5z3V9lZXbNXVAKpwpk-eLrD1Pv63GGz8rr6AVK8XRdUqSEKB9_3mSSzwgq4oqhBaGCDuW9Mtm5dQQvRlFcbOj4rh5zhlmW_gKUDbvqdny7WcCZiQIZ9BjGWvXYn00oKVD8Eo3TUSBoMO9W-keDs98s2DL6I1Z4IxrkWdozce-bRXgtaCBKu1Y8BS8iNRVVLw0JhiUD4J7-0oWB40oYa6NrtxA2HPkHy_KpvQ',
    quote: '"A sun-drenched journey from the urban elegance of Sydney\'s harbor to the breathtaking aquatic kaleidoscope of the Great Barrier Reef. Experience the best of the Land Down Under."',
    center: { lat: -33.8568, lng: 151.2153 },
    zoom: 13,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Sydney Icons',
        dateStr: 'Nov 12, 2026',
        summary: 'Explore Sydney Harbour, historic Rocks quarter, and the world-famous sails.',
        stops: [
          {
            id: 'aus-d1-s1',
            dayNumber: 1,
            title: 'Sydney Opera House',
            subtitle: 'Bennelong Point, Sydney NSW',
            description: 'Marvel at the UNESCO-listed architectural masterpiece. Enjoy guided backstage tour, harbor promenade walk, and sunset cocktails by the water.',
            locationName: 'Sydney Opera House',
            coordinates: { lat: -33.8568, lng: 151.2153 },
            timeSlot: '09:30 AM',
            duration: '2.5 hrs',
            category: 'landmark',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjeRw8495g7sWRuL0w1I5z3V9lZXbNXVAKpwpk-eLrD1Pv63GGz8rr6AVK8XRdUqSEKB9_3mSSzwgq4oqhBaGCDuW9Mtm5dQQvRlFcbOj4rh5zhlmW_gKUDbvqdny7WcCZiQIZ9BjGWvXYn00oKVD8Eo3TUSBoMO9W-keDs98s2DL6I1Z4IxrkWdozce-bRXgtaCBKu1Y8BS8iNRVVLw0JhiUD4J7-0oWB40oYa6NrtxA2HPkHy_KpvQ',
            address: 'Bennelong Point, Sydney NSW 2000, Australia',
            tips: ['Book Architectural Tour in advance', 'Best photography spot is from Mrs Macquarie\'s Chair', 'Catch the evening illumination on the sails'],
            offlineCached: true,
            weatherForecast: { temp: '24°C', condition: 'Sunny with coastal breeze', icon: 'wb_sunny' }
          },
          {
            id: 'aus-d1-s2',
            dayNumber: 1,
            title: 'Sydney Harbour Bridge Pylon Lookout',
            subtitle: 'The Rocks, Sydney',
            description: 'Ascend 200 steps to the original granite pylon for 360-degree panorama of Sydney Harbour, Circular Quay ferries, and distant skyline.',
            locationName: 'Sydney Harbour Bridge',
            coordinates: { lat: -33.8523, lng: 151.2108 },
            timeSlot: '02:00 PM',
            duration: '1.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
            address: 'Sydney Harbour Bridge, The Rocks NSW 2000',
            tips: ['Heritage museum inside the pylon details the 1932 construction', 'Great angle for wide-angle harbor photos'],
            offlineCached: true,
            weatherForecast: { temp: '23°C', condition: 'Clear', icon: 'sunny' }
          },
          {
            id: 'aus-d1-s3',
            dayNumber: 1,
            title: 'Bondi to Coogee Coastal Walk',
            subtitle: 'Eastern Suburbs Coastline',
            description: 'A 6km picturesque clifftop trail featuring sandstone cliffs, turquoise ocean pools, Bronte Beach, and Tamarama sculpture grounds.',
            locationName: 'Bondi Beach Pavilion',
            coordinates: { lat: -33.8915, lng: 151.2767 },
            timeSlot: '04:30 PM',
            duration: '2.0 hrs',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80',
            address: 'Queen Elizabeth Dr, Bondi Beach NSW 2026',
            tips: ['Stop for a flat white at Bronte Baths cafe', 'Bring swimwear for icebergs ocean pool'],
            offlineCached: true,
            weatherForecast: { temp: '22°C', condition: 'Mild coastal', icon: 'air' }
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: The Reef',
        dateStr: 'Nov 13, 2026',
        summary: 'Fly to tropical Cairns and immerse in the world\'s largest living coral reef ecosystem.',
        stops: [
          {
            id: 'aus-d2-s1',
            dayNumber: 2,
            title: 'Great Barrier Reef Snorkeling',
            subtitle: 'Outer Agincourt Ribbon Reef, Cairns',
            description: 'Dive into warm crystal waters teeming with clownfish, sea turtles, giant clams, and vibrant coral formations on an eco-certified catamaran.',
            locationName: 'Great Barrier Reef Marine Park',
            coordinates: { lat: -16.7758, lng: 145.9680 },
            timeSlot: '08:30 AM',
            duration: '6.0 hrs',
            category: 'nature',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGmRqYv8r09Kt8jvsxQmiNeyAztEzJVo2ua6XLhOYtt7osx0mLZdby_FI23AdMzZ8IDyM6oIZgQxKgcEotx4kFwypWiaXWmYUSkvHlXU5p2vbrjfSnel0uEZox1B_vfbrVzt9zh9s0HY04FemRXz-ACkwws8u3l1vLFhQ6RDKiYG2IgOMmn5ZZqXsAILJbSZ6jyvtnVX18Sn95tPedY0NGktQZKv9XVOBt5mft5QrVA72pn7FC5zWzMg',
            address: 'Reef Fleet Terminal, 1 Spence St, Cairns City QLD 4870',
            tips: ['Reef-safe biodegradable sunscreen provided on board', 'Underwater camera rental available at marina', 'Semi-submersible submarine ride included for non-swimmers'],
            offlineCached: true,
            weatherForecast: { temp: '28°C', condition: 'Tropical sunshine', icon: 'wb_sunny' }
          },
          {
            id: 'aus-d2-s2',
            dayNumber: 2,
            title: 'Cairns Esplanade Lagoon & Night Markets',
            subtitle: 'Cairns Waterfront',
            description: 'Unwind at the salt-water swimming lagoon overlooking Trinity Inlet, followed by dinner at lively tropical food stalls and local artisan stalls.',
            locationName: 'Cairns Esplanade Lagoon',
            coordinates: { lat: -16.9186, lng: 145.7781 },
            timeSlot: '06:00 PM',
            duration: '2.5 hrs',
            category: 'dining',
            imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
            address: '52/54 Esplanade, Cairns City QLD 4870',
            tips: ['Free public BBQ facilities and outdoor showers available', 'Sample fresh barramundi and tropical mango gelato'],
            offlineCached: true,
            weatherForecast: { temp: '25°C', condition: 'Balmy evening', icon: 'nights_stay' }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Ancient Rainforests & Valleys',
        dateStr: 'Nov 14, 2026',
        summary: 'Explore the UNESCO heritage Daintree rainforest canopy and Blue Mountains valleys.',
        stops: [
          {
            id: 'aus-d3-s1',
            dayNumber: 3,
            title: 'Daintree Rainforest & Mossman Gorge',
            subtitle: 'Kuku Yalanji Country, Queensland',
            description: 'Walk through 180-million-year-old prehistoric rainforest along elevated boardwalks with traditional First Nations interpretive insights.',
            locationName: 'Mossman Gorge Centre',
            coordinates: { lat: -16.4674, lng: 145.3444 },
            timeSlot: '09:00 AM',
            duration: '3.5 hrs',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            address: '212 Mossman Gorge Rd, Mossman QLD 4873',
            tips: ['Take the guided Ngadiku Dreamtime Walk', 'Keep an eye out for Ulysses butterflies and cassowaries'],
            offlineCached: true,
            weatherForecast: { temp: '27°C', condition: 'Lush tropical misty', icon: 'cloud' }
          },
          {
            id: 'aus-d3-s2',
            dayNumber: 3,
            title: 'Cape Tribulation Beach Lookout',
            subtitle: 'Where the Rainforest meets the Reef',
            description: 'Stand at the singular geographic point on earth where two UNESCO World Heritage sites touch: the tropical rainforest and coral reef.',
            locationName: 'Cape Tribulation',
            coordinates: { lat: -16.0827, lng: 145.4619 },
            timeSlot: '02:30 PM',
            duration: '2.0 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            address: 'Cape Tribulation Rd, Cape Tribulation QLD 4873',
            tips: ['Kulki Boardwalk leads to panoramic elevated viewing platform', 'Crocodile safety notices must be observed'],
            offlineCached: true,
            weatherForecast: { temp: '29°C', condition: 'Sunny', icon: 'wb_sunny' }
          }
        ]
      }
    ]
  },
  {
    id: 'china-silk-road-wonders',
    title: 'China Imperial & Ancient Marvels',
    subtitle: 'Forbidden palaces, ancient terra-cotta & high-speed rail wonders',
    dateRange: 'OCT 08 — OCT 18 • 2 Travelers',
    travelersCount: 2,
    destination: 'Beijing & Xi\'an, China',
    regionCountry: 'China',
    isChinaRegion: true,
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    quote: '"From the crimson courtyards of the Forbidden City to the thousand-year guardians of the Silk Road. An epic voyage through the heart of dynastic China with AutoNavi precision."',
    center: { lat: 39.9163, lng: 116.3972 },
    zoom: 12,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Beijing Imperial Heart (北京皇城)',
        dateStr: 'Oct 08, 2026',
        summary: 'Discover the Palace Museum and panoramic views from Jingshan Hill.',
        stops: [
          {
            id: 'chn-d1-s1',
            dayNumber: 1,
            title: 'The Forbidden City (故宫博物院)',
            subtitle: 'Dongcheng District, Beijing',
            description: 'Walk through the grand Meridian Gate into the world\'s largest ancient palatial complex with 9,999 halls of Ming and Qing dynasties.',
            locationName: 'Palace Museum (故宫)',
            coordinates: { lat: 39.9163, lng: 116.3972 },
            timeSlot: '08:30 AM',
            duration: '4.0 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=800&q=80',
            address: '4 Jingshan Front St, Dongcheng, Beijing, China',
            tips: ['Passport required for entry verification', 'Enter via Meridian Gate and exit through Gate of Divine Prowess', 'Download AMap offline voice tour'],
            offlineCached: true,
            weatherForecast: { temp: '19°C', condition: 'Crisp autumn sky', icon: 'wb_sunny' }
          },
          {
            id: 'chn-d1-s2',
            dayNumber: 1,
            title: 'Jingshan Park Panorama (景山公园)',
            subtitle: 'Central Axis Summit',
            description: 'Climb Wanchun Pavilion on the central peak for an uninterrupted birds-eye view across the golden roofs of the entire Forbidden City.',
            locationName: 'Jingshan Park',
            coordinates: { lat: 39.9234, lng: 116.3965 },
            timeSlot: '03:00 PM',
            duration: '1.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
            address: '44 Jingshan W St, Xicheng, Beijing',
            tips: ['Best sunset photography point along Beijing\'s historic central axis', 'Traditional teahouse inside the garden'],
            offlineCached: true,
            weatherForecast: { temp: '18°C', condition: 'Clear golden hour', icon: 'wb_sunny' }
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Mutianyu Great Wall (慕田峪长城)',
        dateStr: 'Oct 09, 2026',
        summary: 'Experience the rugged mountain ridges and watchtowers of the Great Wall.',
        stops: [
          {
            id: 'chn-d2-s1',
            dayNumber: 2,
            title: 'Mutianyu Great Wall Ridge',
            subtitle: 'Huairou District, Beijing',
            description: 'Hike along 22 ancient stone watchtowers surrounded by vibrant autumn foliage, with cable car ascent and thrilling alpine toboggan descent.',
            locationName: 'Mutianyu Great Wall',
            coordinates: { lat: 40.4319, lng: 116.5704 },
            timeSlot: '09:00 AM',
            duration: '4.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
            address: 'Mutianyu Village, Bohai Town, Huairou District, Beijing',
            tips: ['Watchtower 14 to 20 offer the steepest mountain vistas', 'Toboggan down from Tower 6 for high-speed fun'],
            offlineCached: true,
            weatherForecast: { temp: '16°C', condition: 'Fresh mountain breeze', icon: 'air' }
          },
          {
            id: 'chn-d2-s2',
            dayNumber: 2,
            title: 'Summer Palace & Kunming Lake (颐和园)',
            subtitle: 'Haidian District, Beijing',
            description: 'Stroll the Long Corridor and cruise Kunming Lake in a dragon boat amidst classical Qing imperial gardens.',
            locationName: 'Summer Palace',
            coordinates: { lat: 39.9999, lng: 116.2755 },
            timeSlot: '03:30 PM',
            duration: '2.5 hrs',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
            address: '19 Xinjiangongmen Rd, Haidian District, Beijing',
            tips: ['Seventeen-Arch Bridge illuminates brilliantly in late afternoon', 'Marble Boat is an imperial curiosity'],
            offlineCached: true,
            weatherForecast: { temp: '17°C', condition: 'Mild', icon: 'wb_sunny' }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Xi\'an Terracotta Warriors (西安兵马俑)',
        dateStr: 'Oct 10, 2026',
        summary: 'Silk Road terminus and the legendary subterranean army of Emperor Qin Shi Huang.',
        stops: [
          {
            id: 'chn-d3-s1',
            dayNumber: 3,
            title: 'Emperor Qinshihuang\'s Mausoleum Site',
            subtitle: 'Lintong District, Xi\'an',
            description: 'Gaze upon thousands of life-sized clay soldiers, horses, and chariots preserved for over 2,200 years in massive excavation pits.',
            locationName: 'Terracotta Warriors Museum',
            coordinates: { lat: 34.3841, lng: 109.2785 },
            timeSlot: '09:30 AM',
            duration: '3.5 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
            address: 'Qinling North Rd, Lintong District, Xi\'an, Shaanxi',
            tips: ['Pit 1 has the grand main infantry phalanx', 'Bronze Chariots exhibition in hall 2 is world-renowned'],
            offlineCached: true,
            weatherForecast: { temp: '20°C', condition: 'Partly cloudy', icon: 'partly_cloudy_day' }
          }
        ]
      }
    ]
  },
  {
    id: 'japan-zen-journey',
    title: 'Japanese Zen & Modern Metropolis',
    subtitle: 'Kyoto shrines, moss gardens & Tokyo neon avenues',
    dateRange: 'NOV 25 — DEC 04 • 2 Travelers',
    travelersCount: 2,
    destination: 'Kyoto & Tokyo, Japan',
    regionCountry: 'Japan',
    isChinaRegion: false,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    quote: '"Under vermilion gates and cascading maple leaves, wander from the tranquil tea rooms of Kyoto to the bustling energy of Tokyo."',
    center: { lat: 34.9671, lng: 135.7727 },
    zoom: 13,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Kyoto Shrines & Temples',
        dateStr: 'Nov 25, 2026',
        summary: 'Walk the sacred path of ten thousand torii gates at Fushimi Inari.',
        stops: [
          {
            id: 'jpn-d1-s1',
            dayNumber: 1,
            title: 'Fushimi Inari-Taisha (伏見稲荷大社)',
            subtitle: 'Fushimi Ward, Kyoto',
            description: 'Ascend the forested mountain trail lined with thousands of vibrant vermilion torii gates dedicated to the Shinto deity of agriculture and prosperity.',
            locationName: 'Fushimi Inari Taisha',
            coordinates: { lat: 34.9671, lng: 135.7727 },
            timeSlot: '07:30 AM',
            duration: '2.5 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80',
            address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto 612-0882',
            tips: ['Early morning visit avoids tourist crowds', 'Hike up to Yotsutsuji intersection for Kyoto city overlook'],
            offlineCached: true,
            weatherForecast: { temp: '15°C', condition: 'Autumn chill', icon: 'wb_sunny' }
          },
          {
            id: 'jpn-d1-s2',
            dayNumber: 1,
            title: 'Kiyomizu-dera & Sannenzaka (清水寺)',
            subtitle: 'Higashiyama Ward, Kyoto',
            description: 'Historic wooden temple perched on cliffside without a single nail. Stroll down preserved cobblestone streets lined with traditional matcha sweets shops.',
            locationName: 'Kiyomizu-dera',
            coordinates: { lat: 34.9949, lng: 135.7850 },
            timeSlot: '01:30 PM',
            duration: '2.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            address: '1 Chome-294 Kiyomizu, Higashiyama Ward, Kyoto 605-0862',
            tips: ['Drink from Otowa Waterfall three streams for health, longevity, or success in studies', 'Taste fresh warm Yatsuhashi pastries'],
            offlineCached: true,
            weatherForecast: { temp: '14°C', condition: 'Clear afternoon', icon: 'wb_sunny' }
          }
        ]
      }
    ]
  }
];
