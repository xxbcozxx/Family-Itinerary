import { Itinerary } from '../types';

export const SAMPLE_ITINERARIES: Itinerary[] = [
  // =========================================================================
  // 1. BEIJING DECEMBER WINTER TRIP 2026 (UPCOMING TRIP - DEFAULT ACTIVE)
  // =========================================================================
  {
    id: 'beijing-dec-2026',
    title: 'Beijing Winter Wonder · 北京冬季之旅',
    subtitle: 'Imperial Dynasties, Snow-Capped Great Wall & Hutong Culture',
    dateRange: 'DEC 2026 • Upcoming Trip',
    travelersCount: 4,
    destination: 'Beijing, China (北京)',
    regionCountry: 'China',
    isChinaRegion: true,
    coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80',
    quote: '"Crisp winter air, crimson imperial walls, smoking Peking duck ovens, and ice skating on frozen Kunming Lake. Ready for your personalized December Beijing adventure."',
    center: { lat: 39.9163, lng: 116.3972 },
    zoom: 12,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Imperial Heart (故宫 & 景山)',
        dateStr: 'Dec 2026',
        summary: 'Explore the Forbidden City, panoramic views from Jingshan Summit, and Siji Minfu Peking Duck.',
        stops: [
          {
            id: 'bj-d1-s1',
            dayNumber: 1,
            title: 'The Forbidden City · 故宫博物院',
            subtitle: 'Meridian Gate to Gate of Divine Prowess',
            description: 'Walk through the grand Meridian Gate into the world\'s largest ancient palatial complex with 9,999 halls of the Ming and Qing dynasties. Stunning contrast of crimson walls against winter skies.',
            locationName: '故宫博物院 (Palace Museum)',
            coordinates: { lat: 39.9163, lng: 116.3972 },
            timeSlot: '08:30 AM',
            duration: '4.0 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=800&q=80',
            address: '4 Jingshan Front St, Dongcheng, Beijing',
            tips: [
              'Passport required for real-name entry verification at Meridian Gate (午门)',
              'Book tickets 7 days in advance via official mini-program at 8:00 PM sharp',
              'Treasures Gallery (珍宝馆) and Clocks Gallery (钟表馆) are well worth the extra ¥10 ticket'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-2°C', condition: 'Crisp winter sky', icon: 'ac_unit' }
          },
          {
            id: 'bj-d1-s2',
            dayNumber: 1,
            title: 'Jingshan Park · 景山公园 (万春亭)',
            subtitle: 'Central Axis Overlook & Golden Hour',
            description: 'Climb Wanchun Pavilion on the central peak for an uninterrupted 360-degree panorama over the golden tiled roofs of the entire Forbidden City and Beijing modern skyline.',
            locationName: '景山公园 (Jingshan Park)',
            coordinates: { lat: 39.9234, lng: 116.3965 },
            timeSlot: '02:30 PM',
            duration: '1.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
            address: '44 Jingshan W St, Xicheng, Beijing',
            tips: [
              'Directly opposite the exit of Forbidden City (Gate of Divine Prowess / 神武门)',
              'Golden hour lighting between 3:30 PM – 4:30 PM in December is breathtaking'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-1°C', condition: 'Clear afternoon', icon: 'wb_sunny' }
          },
          {
            id: 'bj-d1-s3',
            dayNumber: 1,
            title: 'Siji Minfu Peking Duck · 四季民福烤鸭店 (故宫店 / 灯市口店)',
            subtitle: 'Signature Crispy Duck & Traditional Beijing Flavors',
            description: 'Savor traditional wood-fired Peking duck with paper-thin crispy skin dipped in sugar, handmade wraps, Zhajiangmian noodles, and candied hawthorn pastries.',
            locationName: '四季民福烤鸭店 (故宫景观店)',
            coordinates: { lat: 39.9142, lng: 116.4042 },
            timeSlot: '05:30 PM',
            duration: '2.0 hrs',
            category: 'dining',
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
            address: '东华门大街11号 (Near Forbidden City East Gate)',
            tips: [
              'Take an online queue number via 大众点评 (Dianping) 2 hours in advance to minimize waiting',
              'Request a window seat overlooking the Forbidden City moat if possible'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-4°C', condition: 'Freezing evening', icon: 'nights_stay' }
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Mutianyu Great Wall (慕田峪长城)',
        dateStr: 'Dec 2026',
        summary: 'Climb 22 ancient stone watchtowers, cable car ascent, and toboggan slide.',
        stops: [
          {
            id: 'bj-d2-s1',
            dayNumber: 2,
            title: 'Mutianyu Great Wall · 慕田峪长城',
            subtitle: 'Huairou District, Beijing',
            description: 'Hike along 22 ancient stone watchtowers surrounded by snow-dusted mountain ridges. Take the enclosed cable car up to Tower 14 and ride the alpine toboggan down from Tower 6.',
            locationName: '慕田峪长城 (Mutianyu Great Wall)',
            coordinates: { lat: 40.4319, lng: 116.5704 },
            timeSlot: '09:00 AM',
            duration: '4.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
            address: 'Mutianyu Village, Bohai Town, Huairou District, Beijing',
            tips: [
              'Watchtowers 14 to 20 offer the steepest and most dramatic mountain vistas',
              'Dress in windproof layers and wear sturdy hiking boots for icy steps',
              'Private car hire or direct bus shuttle from Dongzhimen is recommended'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-6°C', condition: 'Breezy & clear', icon: 'air' }
          },
          {
            id: 'bj-d2-s2',
            dayNumber: 2,
            title: 'Olympic Park & Bird\'s Nest · 鸟巢 & 水立方夜景',
            subtitle: 'National Stadium & Ice Cube Illumination',
            description: 'Admire the monumental steel architecture of the 2008 & 2022 Olympic venues glowing with vibrant color-changing LED lighting in the winter evening.',
            locationName: '国家体育场 (Bird\'s Nest)',
            coordinates: { lat: 39.9929, lng: 116.3965 },
            timeSlot: '05:30 PM',
            duration: '1.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
            address: '1 National Stadium S Rd, Chaoyang, Beijing',
            tips: [
              'Stroll along the central Olympic green for wide-angle exterior photos without needing tickets',
              'Hot ginger tea kiosks available along the plaza'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-5°C', condition: 'Clear night', icon: 'nights_stay' }
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Summer Palace & Hutongs (颐和园 & 什刹海)',
        dateStr: 'Dec 2026',
        summary: 'Kunming Lake ice skating, Nanluoguxiang boutique hutongs, and copper hot pot.',
        stops: [
          {
            id: 'bj-d3-s1',
            dayNumber: 3,
            title: 'Summer Palace · 颐和园 (昆明湖滑冰场)',
            subtitle: 'Haidian District, Beijing',
            description: 'Stroll the Long Corridor, gaze at the Tower of Buddhist Incense, and enjoy natural ice sledding on the frozen expanse of Kunming Lake with Seventeen-Arch Bridge backdrop.',
            locationName: '颐和园 (Summer Palace)',
            coordinates: { lat: 39.9999, lng: 116.2755 },
            timeSlot: '09:00 AM',
            duration: '3.5 hrs',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
            address: '19 Xinjiangongmen Rd, Haidian District, Beijing',
            tips: [
              'Kunming Lake ice rink opens in late December when ice thickness reaches 15cm',
              'Single and double ice bicycles are available for rent at the lake'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-3°C', condition: 'Crisp sunny winter', icon: 'ac_unit' }
          },
          {
            id: 'bj-d3-s2',
            dayNumber: 3,
            title: 'Shichahai & Nanluoguxiang · 什刹海 & 南锣鼓巷',
            subtitle: 'Historic Hutong Courtyards & Street Snacks',
            description: 'Wander through Beijing\'s best-preserved old hutong alleyways, lakefront bridges at Yinding Bridge, indie craft shops, candied hawthorns (冰糖葫芦), and roasted chestnuts.',
            locationName: '南锣鼓巷 (Nanluoguxiang)',
            coordinates: { lat: 39.9388, lng: 116.4025 },
            timeSlot: '02:30 PM',
            duration: '3.0 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
            address: 'Nanluoguxiang, Dongcheng, Beijing',
            tips: [
              'Branch out into side alleys like Mao\'er Hutong and Badaowan for authentic courtyard houses',
              'Warm up inside cozy indie cafes overlooking Houhai Lake'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-2°C', condition: 'Partly cloudy', icon: 'partly_cloudy_day' }
          },
          {
            id: 'bj-d3-s3',
            dayNumber: 3,
            title: 'Jubaoyuan Traditional Mutton Hotpot · 聚宝源老北京铜锅涮肉',
            subtitle: 'Charcoal Brass Hot Pot & Hand-Cut Fresh Lamb',
            description: 'Boil hand-cut fresh lamb and beef in bubbling clear broth inside a classic cloisonné copper pot with fragrant sesame paste dip and freshly baked sesame shaobing.',
            locationName: '聚宝源 (牛街总店 / 什刹海店)',
            coordinates: { lat: 39.8835, lng: 116.3642 },
            timeSlot: '06:00 PM',
            duration: '2.0 hrs',
            category: 'dining',
            imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
            address: '牛街5-2号 (Niujie Street)',
            tips: [
              'Order the signature hand-cut fresh mutton (手切鲜羊肉) and crispy sesame shaobing (芝麻烧饼)',
              'Traditional charcoal chimney pot is the ultimate winter comfort food'
            ],
            offlineCached: true,
            weatherForecast: { temp: '-6°C', condition: 'Winter evening', icon: 'nights_stay' }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. GUANGZHOU FAMILY TRIP 2026 (PAST TRIP 1)
  // =========================================================================
  {
    id: 'guangzhou-family-2026',
    title: '广州亲子游 · Guangzhou Family Trip 2026',
    subtitle: 'Family Journey · 森林海、长隆野生动物世界、西关与珠江',
    dateRange: '2026-06-01 → 2026-06-11 • 11 Days',
    travelersCount: 4,
    destination: 'Guangzhou, China (广州)',
    regionCountry: 'China',
    isChinaRegion: true,
    coverImage: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?auto=format&fit=crop&w=1200&q=80',
    quote: '"11-day family journey spanning Forest Sea hot springs resort, Chimelong Safari & International Circus, Beijing Road food crawl, Xiguan Yongqingfang, Dongshankou art quarter, and Canton Tower photoshoot."',
    center: { lat: 23.1291, lng: 113.2644 },
    zoom: 12,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: 启程广州 (Depart for Guangzhou)',
        dateStr: '2026-06-01 (Mon)',
        summary: '新加坡 → 广州白云国际机场 → 增城·森林海国际房车营地',
        stops: [
          {
            id: 'gz-d1-s1',
            dayNumber: 1,
            title: '搭乘南方航空CZ3040航班飞往广州',
            subtitle: 'Singapore Changi (SIN) → Guangzhou Baiyun (CAN)',
            description: 'CZ3040: Depart SIN 17:50 → Arrive CAN 22:10. Seats: (Nga) 61C, 61H, 61J, 61K / (Quek) 60H, 60J, 60K.',
            locationName: '新加坡樟宜机场 (Changi Airport)',
            coordinates: { lat: 1.3644, lng: 103.9915 },
            timeSlot: '17:50',
            duration: '4.3 hrs',
            category: 'activity',
            address: 'Singapore Changi Airport T1',
            tips: ['Leave home for airport at 13:30', 'Film pocket vlog intro with kids at gate'],
            offlineCached: true
          },
          {
            id: 'gz-d1-s2',
            dayNumber: 1,
            title: '入住广州森林海温泉度假酒店 / 房车营地',
            subtitle: '增城区派潭镇白水寨大道',
            description: '取行李后搭乘专车前往酒店。森林海国际房车营地，办理入住稍作休整。管家电话: 181 22001 1257 (微信同号)。',
            locationName: '广州森林海温泉度假酒店',
            coordinates: { lat: 23.4789, lng: 113.7342 },
            timeSlot: '23:30',
            duration: 'Overnight',
            category: 'hotel',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            address: '广州市增城区派潭镇白水寨大道101号',
            tips: ['Navigation search: 森林海国际房车营地', 'Late night arrival shots are great for family vlog'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: 森林海休闲日 (Forest Sea Leisure Day)',
        dateStr: '2026-06-02 (Tue)',
        summary: '亲子设施、一票通嬉水乐园、森林乐园 & 柴火竹筒饭',
        stops: [
          {
            id: 'gz-d2-s1',
            dayNumber: 2,
            title: '一票通嬉水乐园 & 森林乐园',
            subtitle: '森林海温泉度假酒店内',
            description: '全天自由活动：享用酒店早餐，畅玩亲子水上嬉水乐园、温泉泡池与森林探险乐园。',
            locationName: '森林海温泉度假酒店',
            coordinates: { lat: 23.4789, lng: 113.7342 },
            timeSlot: '全天',
            duration: 'Full Day',
            category: 'activity',
            imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            address: '广州市增城区派潭镇',
            tips: ['Pocket 4 is splash-resistant, not waterproof — film from deck', 'Relax and recover from late arrival'],
            offlineCached: true
          },
          {
            id: 'gz-d2-s2',
            dayNumber: 2,
            title: '竹里香土法柴火竹筒饭',
            subtitle: '增城特色农家美食',
            description: '品尝地道柴火烤制竹筒饭、走地鸡与派潭山水豆腐。',
            locationName: '竹里香土法柴火竹筒饭',
            coordinates: { lat: 23.4712, lng: 113.7298 },
            timeSlot: '午餐 / 晚餐',
            duration: '1.5 hrs',
            category: 'dining',
            address: '增城区派潭镇白水寨大道',
            tips: ['Freshly cooked bamboo tube rice with fragrant chicken'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: 转场长隆，品味顺德 (Transfer to Chimelong)',
        dateStr: '2026-06-03 (Wed)',
        summary: '森林海 → 番禺长隆熊猫酒店 → 顺德滋粥楼 → 长隆国际大马戏',
        stops: [
          {
            id: 'gz-d3-s1',
            dayNumber: 3,
            title: '长隆熊猫酒店 (Chimelong Panda Hotel)',
            subtitle: '广州番禺区长隆旅游度假区',
            description: '11:00森林海退房，专车12:00-13:30抵达番禺办理入住。全熊猫主题客房，享受酒店亲子设施。',
            locationName: '长隆熊猫酒店',
            coordinates: { lat: 23.0039, lng: 113.3276 },
            timeSlot: '13:30',
            duration: 'Check-in',
            category: 'hotel',
            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            address: '广州市番禺区番禺大道长隆旅游度假区内',
            tips: ['Capture kids\' genuine excitement upon seeing the panda decorations'],
            offlineCached: true
          },
          {
            id: 'gz-d3-s2',
            dayNumber: 3,
            title: '滋粥楼·顺德菜 (番禺广场总店)',
            subtitle: '顺德传统米水粥火锅 & 顺德名菜',
            description: '17:00-17:30错峰晚餐。推荐无骨鱼、生滚鱼片粥、煎酿三宝、顺德双皮奶。',
            locationName: '滋粥楼·顺德菜 (番禺广场总店)',
            coordinates: { lat: 22.9382, lng: 113.3845 },
            timeSlot: '17:00',
            duration: '1.5 hrs',
            category: 'dining',
            address: '番禺区番禺广场总店 (点评提前排号取号)',
            tips: ['Take number via Dianping app before arriving to avoid wait'],
            offlineCached: true
          },
          {
            id: 'gz-d3-s3',
            dayNumber: 3,
            title: '长隆国际大马戏',
            subtitle: '长隆国际大马戏剧场',
            description: '19:30-20:50震撼实景大马戏表演。多国顶尖马戏演员、空中飞人与巡游互动。门票需于入住当日使用。',
            locationName: '长隆国际大马戏剧场',
            coordinates: { lat: 23.0012, lng: 113.3298 },
            timeSlot: '19:30',
            duration: '1.5 hrs',
            category: 'activity',
            address: '番禺区长隆旅游度假区内',
            tips: ['Enter early to secure central middle-row seats', 'Verify recording policy at entrance'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Day 4: 长隆狂欢日 (Chimelong Safari Carnival)',
        dateStr: '2026-06-04 (Thu)',
        summary: '早享小火车、白虎跳水、喂长颈鹿、大熊猫三胞胎、空中缆车 & 花车巡游',
        stops: [
          {
            id: 'gz-d4-s1',
            dayNumber: 4,
            title: '长隆野生动物世界 · 北门早享小火车',
            subtitle: 'Chimelong Safari Park North Gate',
            description: '09:00持早享票北门提前入园直冲乘车区小火车，近距离穿越亚洲与非洲草原看自由漫步的动物群。',
            locationName: '长隆野生动物世界',
            coordinates: { lat: 23.0075, lng: 113.3218 },
            timeSlot: '09:00 AM',
            duration: '1.5 hrs',
            category: 'activity',
            imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
            address: '番禺区大石街道长隆野生动物世界',
            tips: ['Sit on the right side of the mini train for best animal viewing'],
            offlineCached: true
          },
          {
            id: 'gz-d4-s2',
            dayNumber: 4,
            title: '百虎山白虎跳水 & 长颈鹿广场喂食',
            subtitle: 'White Tiger Mountain & Giraffe Plaza',
            description: '10:00观看白虎捕食跳水绝技；长颈鹿广场买树枝近距离亲手喂食长颈鹿，互动出片率极高。参观熊猫乐园三胞胎萌帅酷与考拉馆。',
            locationName: '长颈鹿广场',
            coordinates: { lat: 23.0055, lng: 113.3245 },
            timeSlot: '10:00 AM',
            duration: '3.0 hrs',
            category: 'nature',
            address: '长隆野生动物世界 步行区',
            tips: ['Tree branch is ¥36/branch, incredible family photo opportunity', 'Set camera in 4K 120fps slow-mo for tiger dive'],
            offlineCached: true
          },
          {
            id: 'gz-d4-s3',
            dayNumber: 4,
            title: '空中缆车俯瞰大草原 & 熊猫酒店套餐晚餐',
            subtitle: 'Transparent Floor Cable Car & Float Parade',
            description: '14:00搭乘全透明底板空中缆车720度俯瞰东非大草原；16:30观看欢腾花车大巡游，晚间回熊猫酒店享用套餐晚餐。',
            locationName: '长隆空中缆车',
            coordinates: { lat: 23.0068, lng: 113.3235 },
            timeSlot: '14:00',
            duration: '3.5 hrs',
            category: 'activity',
            address: '长隆野生动物世界 空中缆车站',
            tips: ['Point camera DOWN through the transparent floor for walking animals'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Day 5: 转场市区，漫步北京路 (To City & Beijing Road)',
        dateStr: '2026-06-05 (Fri)',
        summary: '入住北京路美居酒店、天河城中华四季寿司、陈添记鱼皮、大佛寺夜景',
        stops: [
          {
            id: 'gz-d5-s1',
            dayNumber: 5,
            title: '北京路美居酒店 (Mercure Beijing Road)',
            subtitle: '入住市区核心商圈',
            description: '约10:00退房专车前往北京路美居酒店。办理入住与行李寄存。',
            locationName: '北京路美居酒店',
            coordinates: { lat: 23.1258, lng: 113.2685 },
            timeSlot: '11:30',
            duration: 'Check-in',
            category: 'hotel',
            address: '广州市越秀区北京路商圈',
            tips: ['Steps away from Beijing Road pedestrian street and dining'],
            offlineCached: true
          },
          {
            id: 'gz-d5-s2',
            dayNumber: 5,
            title: '北京路地道小吃街 & 购物',
            subtitle: '陈添记、达扬炖品、MINISO LAND、动漫星城',
            description: '品尝陈添记爽脆鱼皮、香港五代同糖、达扬原味椰子炖竹丝鸡、银记肠粉；打卡MINISO LAND与天河城爱心树。晚餐选民记煲仔饭或大鸽饭。',
            locationName: '北京路步行街',
            coordinates: { lat: 23.1265, lng: 113.2692 },
            timeSlot: '下午',
            duration: '4.0 hrs',
            category: 'dining',
            address: '越秀区北京路步行街 / 文明路 / 惠福东路',
            tips: ['大鸽饭 need to call and book via number in Dianping'],
            offlineCached: true
          },
          {
            id: 'gz-d5-s3',
            dayNumber: 5,
            title: '大佛寺夜景 & 千年古道遗址',
            subtitle: 'Dafo Temple & Ancient Thousand-Year Road Site',
            description: '夜晚游览灯火璀璨如《千与千寻》的大佛寺金阁与玻璃地面下的宋元明清千年古道地层遗址。',
            locationName: '大佛寺 (Dafo Temple)',
            coordinates: { lat: 23.1245, lng: 113.2681 },
            timeSlot: '晚上',
            duration: '1.5 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
            address: '越秀区惠福东路惠新中街21号',
            tips: ['Temple exterior illuminates magnificently after sunset at 19:00'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 6,
        title: 'Day 6: 西关风情一日 (Xiguan Heritage Day)',
        dateStr: '2026-06-06 (Sat)',
        summary: '陶陶居早茶、永庆坊月亮桥、粤剧艺术博物馆、李小龙祖居、陈家祠 & 清平饭店',
        stops: [
          {
            id: 'gz-d6-s1',
            dayNumber: 6,
            title: '陶陶居酒家 (第十甫路总店) 早茶',
            subtitle: '百年老字号广式早茶',
            description: '享用陶陶居大虾饺、酥皮水牛奶菠萝包、鲜果榴莲天鹅酥、红米肠。',
            locationName: '陶陶居酒家 (第十甫路店)',
            coordinates: { lat: 23.1158, lng: 113.2425 },
            timeSlot: '上午',
            duration: '2.0 hrs',
            category: 'dining',
            address: '荔湾区第十甫路20号',
            tips: ['Reserve seats or take number via Dianping early in morning'],
            offlineCached: true
          },
          {
            id: 'gz-d6-s2',
            dayNumber: 6,
            title: '永庆坊 · 月亮桥 & 粤剧艺术博物馆',
            subtitle: 'Yongqingfang & Moon Bridge',
            description: '漫步西关骑楼老街，打卡月亮桥、粤剧艺术博物馆水上戏台、李小龙祖居与星巴克非遗概念店。',
            locationName: '永庆坊 (Yongqingfang)',
            coordinates: { lat: 23.1142, lng: 113.2398 },
            timeSlot: '上午',
            duration: '3.0 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
            address: '荔湾区恩宁路99号',
            tips: ['Moon bridge reflection creates full circular moon shape over water'],
            offlineCached: true
          },
          {
            id: 'gz-d6-s3',
            dayNumber: 6,
            title: '陈家祠 · 岭南建筑艺术明珠',
            subtitle: 'Chen Clan Ancestral Hall',
            description: '参观清代岭南宗祠建筑典范，惊叹于巧夺天工的三雕（木雕、砖雕、石雕）二塑（陶塑、灰塑）一铸铁。',
            locationName: '陈家祠 (Chen Clan Ancestral Hall)',
            coordinates: { lat: 23.1278, lng: 113.2439 },
            timeSlot: '下午',
            duration: '2.0 hrs',
            category: 'culture',
            address: '荔湾区中山七路恩龙里34号',
            tips: ['4月15日至10月15日延时开放至18:00 (17:30截止检票)'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 7,
        title: 'Day 7: 东山口文艺之旅 (Dongshankou Arts)',
        dateStr: '2026-06-07 (Sun)',
        summary: '点都德聚福楼早茶、夏葵园、badmarket、一记面馆、蟹叁宝 & 庙前冰室',
        stops: [
          {
            id: 'gz-d7-s1',
            dayNumber: 7,
            title: '点都德 (聚福楼) 早茶',
            subtitle: 'Classic Cantonese Dim Sum',
            description: '早茶品尝金牌虾饺皇、金沙海虾红米肠、蜜汁叉烧包与香芒椰汁糕。',
            locationName: '点都德 (聚福楼)',
            coordinates: { lat: 23.1235, lng: 113.2895 },
            timeSlot: '上午',
            duration: '1.5 hrs',
            category: 'dining',
            address: '越秀区东山口片区',
            tips: ['Take queue number via Dianping'],
            offlineCached: true
          },
          {
            id: 'gz-d7-s2',
            dayNumber: 7,
            title: '东山口红砖洋房街区漫步',
            subtitle: '夏葵园、慢慢商店、badmarket、MASONPRINCE',
            description: '探索广州最美民国红砖洋房保护区，打卡独立买手店、潮牌店与文创咖啡馆。',
            locationName: '东山口历史文化街区',
            coordinates: { lat: 23.1228, lng: 113.2921 },
            timeSlot: '下午',
            duration: '3.5 hrs',
            category: 'culture',
            address: '越秀区署前路 / 庙前西街 / 培正路',
            tips: ['Great candid streetwear photography on old alleyways'],
            offlineCached: true
          },
          {
            id: 'gz-d7-s3',
            dayNumber: 7,
            title: '蟹叁宝晚餐 & 庙前冰室 Hope & Sesame',
            subtitle: 'Asia\'s 50 Best Bars No.7 / World No.29',
            description: '晚餐享用蟹黄捞饭/捞面；晚间体验隐藏在传统广式冰室假门后的世界顶级 Speakeasy 鸡尾酒吧。',
            locationName: '庙前冰室 (Hope & Sesame)',
            coordinates: { lat: 23.1215, lng: 113.2932 },
            timeSlot: '晚上',
            duration: '2.5 hrs',
            category: 'dining',
            address: '越秀区庙前西街48号 (隐蔽机关暗门入内)',
            tips: ['China No.1, Asia No.7, World No.29 Bar — reservation recommended'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 8,
        title: 'Day 8: 市区人文轻松线 (City Heritage Light)',
        dateStr: '2026-06-08 (Mon)',
        summary: '银灯食府早茶、圣心大教堂、万菱广场、沙面岛欧陆风情街 & 广州酒家文昌总店',
        stops: [
          {
            id: 'gz-d8-s1',
            dayNumber: 8,
            title: '银灯食府早茶 & 广州圣心大教堂',
            subtitle: 'Sacred Heart Cathedral (石室)',
            description: '丽丰国际中心银灯食府品尝早茶；随后参观国内现存最宏伟的双尖塔哥特式全花岗岩石室圣心大教堂。',
            locationName: '广州圣心大教堂',
            coordinates: { lat: 23.1165, lng: 113.2605 },
            timeSlot: '上午',
            duration: '2.5 hrs',
            category: 'culture',
            address: '越秀区一德路旧部前56号',
            tips: ['Dress modestly (shoulders and knees covered) for cathedral entry'],
            offlineCached: true
          },
          {
            id: 'gz-d8-s2',
            dayNumber: 8,
            title: '沙面岛欧陆建筑群 & 星巴克臻选沙面店',
            subtitle: 'Historic Shamian Island European Concession',
            description: '漫步百年古树成荫的沙面岛，欣赏150余栋英法古典折衷主义欧式建筑，在花园星巴克休憩品咖。',
            locationName: '沙面岛 (Shamian Island)',
            coordinates: { lat: 23.1072, lng: 113.2428 },
            timeSlot: '傍晚',
            duration: '2.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            address: '荔湾区沙面北街 / 沙面大街',
            tips: ['Soft evening light filters through giant banyan trees wonderfully'],
            offlineCached: true
          },
          {
            id: 'gz-d8-s3',
            dayNumber: 8,
            title: '广州酒家 (文昌总店) 正餐晚餐',
            subtitle: '“食在广州第一家” 百年国字号',
            description: '品尝文昌鸡、广州第一包、一品天府肉、百花煎酿鸭掌等经典粤菜大作。',
            locationName: '广州酒家 (文昌总店)',
            coordinates: { lat: 23.1182, lng: 113.2448 },
            timeSlot: '晚上',
            duration: '2.0 hrs',
            category: 'dining',
            address: '荔湾区文昌南路2号',
            tips: ['Take number via Dianping app before arriving'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 9,
        title: 'Day 9: 早茶 + 购物 + 丽的面家 (Tea & Shopping & Noodles)',
        dateStr: '2026-06-09 (Tue)',
        summary: '蘩楼早茶、万国奥特莱斯离境即买即退税、北京路步行街、丽的面家竹升面',
        stops: [
          {
            id: 'gz-d9-s1',
            dayNumber: 9,
            title: '蘩楼 (北京路天字码头店) 早茶',
            subtitle: '西关传统手作点心',
            description: '品尝蘩楼露笋虾饺皇、香煎脆皮糯米鸡、红油鲜虾云吞与原笼豉汁蒸排骨。',
            locationName: '蘩楼 (北京路天字码头店)',
            coordinates: { lat: 23.1175, lng: 113.2682 },
            timeSlot: '上午',
            duration: '2.0 hrs',
            category: 'dining',
            address: '越秀区北京南路18号',
            tips: ['Popular morning dim sum spot by Tianzi Wharf'],
            offlineCached: true
          },
          {
            id: 'gz-d9-s2',
            dayNumber: 9,
            title: '万国奥特莱斯 (离境退税购物)',
            subtitle: 'Outlets Shopping with Instant Tax Refund',
            description: '逛各大品牌运动与服饰奥莱折扣店。支持商场1楼现场离境退税集中退付（实退约9%现金）。',
            locationName: '万国奥特莱斯 (Wan Guo Outlets)',
            coordinates: { lat: 23.1095, lng: 113.2758 },
            timeSlot: '中午',
            duration: '3.0 hrs',
            category: 'activity',
            address: '海珠区前进路40号',
            tips: ['Carry physical passport to get Tax Free receipt + form at cashier'],
            offlineCached: true
          },
          {
            id: 'gz-d9-s3',
            dayNumber: 9,
            title: '丽的面家 (珠光店) 传统竹升面晚餐',
            subtitle: '香港米其林主厨传承 正宗鲜虾云吞竹升面',
            description: '地道鸭蛋和面、大竹竿手压爽脆细面。招牌正斗鲜虾净云吞、首创细蓉、金牌脆皮烧肉。',
            locationName: '丽的面家 (珠光店)',
            coordinates: { lat: 23.1192, lng: 113.2721 },
            timeSlot: '晚上',
            duration: '1.5 hrs',
            category: 'dining',
            address: '越秀区文明路 / 珠光路136号',
            tips: ['Pair with red vinegar and pickled chili for authentic kick'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 10,
        title: 'Day 10: 城市地标与经典美食 (Landmarks & Canton Tower)',
        dateStr: '2026-06-10 (Wed)',
        summary: '西华路美食、二沙岛专业约拍(RMB599)、花城广场、广州塔、正佳广场 & 门堂啫啫煲',
        stops: [
          {
            id: 'gz-d10-s1',
            dayNumber: 10,
            title: '西华路老字号美食街巡礼',
            subtitle: '荔林食店、文记手工河粉、英姐鲜奶、沙湾甜品',
            description: '品尝荔林食店招牌猪肉河粉、文记鲜虾肠粉、永昌饼家热出炉蛋挞、英姐鲜奶炸牛奶与沙湾姜撞奶。',
            locationName: '西华路美食街',
            coordinates: { lat: 23.1315, lng: 113.2498 },
            timeSlot: '上午',
            duration: '2.5 hrs',
            category: 'dining',
            address: '荔湾区西华路 (靠近彩虹桥地铁站)',
            tips: ['Film authentic street food montage — steam, pour, and crunch'],
            offlineCached: true
          },
          {
            id: 'gz-d10-s2',
            dayNumber: 10,
            title: '二沙岛艺术公园 · 专业亲子约拍',
            subtitle: '14:00 约拍 (二沙岛艺术公园-西门)',
            description: '二沙岛西门集合。1小时户外专业亲子摄影约拍 (RMB599包9张精修及全部原片底片)。背景与广州塔同框。',
            locationName: '二沙岛艺术公园-西门',
            coordinates: { lat: 23.1128, lng: 113.3125 },
            timeSlot: '14:00',
            duration: '1.5 hrs',
            category: 'activity',
            address: '越秀区二沙岛艺术公园西门',
            tips: ['Already paid RMB200 deposit, balance pay after the session'],
            offlineCached: true
          },
          {
            id: 'gz-d10-s3',
            dayNumber: 10,
            title: '花城广场、广州塔夜景 & 门堂啫啫煲晚餐',
            subtitle: 'Canton Tower Sunset & Sizzling Claypot Dinner',
            description: '黄昏在花城广场与小蛮腰广州塔合影；正佳广场逛极地海洋馆与雨林馆；晚餐在天河南门堂啫啫煲享用滋滋作响的生嗜黄鳝与啫啫牛蛙。',
            locationName: '广州塔 / 花城广场',
            coordinates: { lat: 23.1065, lng: 113.3245 },
            timeSlot: '傍晚 / 晚上',
            duration: '4.0 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?auto=format&fit=crop&w=800&q=80',
            address: '海珠区阅江西路222号 / 天河区天河南一路',
            tips: ['Tower light show switches colors at blue hour — the epic trip closer'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 11,
        title: 'Day 11: 告别羊城 (Farewell Guangzhou)',
        dateStr: '2026-06-11 (Thu)',
        summary: '广式甜品、08:30专车赴机场、CZ3039航班返新加坡',
        stops: [
          {
            id: 'gz-d11-s1',
            dayNumber: 11,
            title: '搭乘专车前往白云机场 & 飞返新加坡',
            subtitle: '南方航空 CZ3039 CAN 12:45 → SIN 16:50',
            description: '08:30美居酒店出发专车前往广州白云机场T2 (车程约50分钟)。办理登机与海关退税核验。座位: (Nga) 61C, 61H, 61J, 61K / (Quek) 60H, 60J, 60K。',
            locationName: '广州白云国际机场 (CAN)',
            coordinates: { lat: 23.3924, lng: 113.2988 },
            timeSlot: '08:30 - 12:45',
            duration: '5.0 hrs',
            category: 'activity',
            address: '广州白云国际机场 T2',
            tips: ['Present tax refund forms and unused goods at customs counter before security'],
            offlineCached: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. SHANGHAI FAMILY TRIP 2026 (PAST TRIP 2)
  // =========================================================================
  {
    id: 'shanghai-family-2026',
    title: '上海行程 · Shanghai Family Trip 2026',
    subtitle: 'Disney Magic, The Bund Skyline & Heritage Citywalks',
    dateRange: '2026-11-24 → 2026-12-03 • 10 Days',
    travelersCount: 4,
    destination: 'Shanghai & Suzhou, China (上海·苏州)',
    regionCountry: 'China',
    isChinaRegion: true,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    quote: '"10-day trip from Toy Story Hotel & full-day Disneyland early rope drop to Nanjing Road, The Bund, Yu Garden, West Nanjing Road, Huaihai Road, Wukang Mansion, Natural History Museum, and Suzhou water towns."',
    center: { lat: 31.2304, lng: 121.4737 },
    zoom: 12,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: 抵达上海 · 迪士尼之夜 (Arrival & Disney Night)',
        dateStr: '2026-11-24 (Mon)',
        summary: '新加坡 (MU546) → 浦东T1 → 玩具总动员酒店 → 迪士尼小镇',
        stops: [
          {
            id: 'sh-d1-s1',
            dayNumber: 1,
            title: 'China Eastern MU546 航班飞往上海',
            subtitle: 'Singapore Changi (SIN) → Shanghai Pudong (PVG) T1',
            description: 'Depart SG 10:10 AM → Arrive Shanghai 03:15 PM. Same time zone as Singapore.',
            locationName: '新加坡樟宜机场',
            coordinates: { lat: 1.3644, lng: 103.9915 },
            timeSlot: '10:10 AM',
            duration: '5.0 hrs',
            category: 'activity',
            address: 'Changi Airport T3',
            tips: ['No jet lag — Shanghai shares GMT+8 with Singapore'],
            offlineCached: true
          },
          {
            id: 'sh-d1-s2',
            dayNumber: 1,
            title: '入住上海迪士尼玩具总动员酒店 (Toy Story Hotel)',
            subtitle: 'Shanghai Disney Resort',
            description: '浦东机场T1滴滴网约车约30分钟直达酒店大堂 (6座约¥155)。办理入住，获明日早享入园资格。晚间穿梭巴士赴迪士尼小镇晚餐并打卡 Coach Café 小笼包冰淇淋。',
            locationName: '玩具总动员酒店 (Toy Story Hotel)',
            coordinates: { lat: 31.1432, lng: 121.6582 },
            timeSlot: '16:30',
            duration: 'Check-in',
            category: 'hotel',
            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            address: '上海市浦东新区申迪西路360号',
            tips: ['Hotel guests enjoy exclusive early park entrance tomorrow morning'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: 上海迪士尼乐园全天 (Shanghai Disneyland Full Day)',
        dateStr: '2026-11-25 (Tue)',
        summary: '7:15早享入园、疯狂动物城热力追踪、矿山车、创极速光轮、飞跃地平线 & 晚8点城堡烟花',
        stops: [
          {
            id: 'sh-d2-s1',
            dayNumber: 2,
            title: '早享入园 & 热门必玩项目刷榜',
            subtitle: '7:15 早享通道入园',
            description: '酒店专用通道提前入园。直冲疯狂动物城热力追踪、七个小矮人矿山车(97cm+)、加勒比海盗沉落宝藏之战、创极速光轮(122cm+)与飞跃地平线。',
            locationName: '上海迪士尼乐园 (Disneyland)',
            coordinates: { lat: 31.1415, lng: 121.6608 },
            timeSlot: '07:15 AM',
            duration: '4.5 hrs',
            category: 'activity',
            imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
            address: '浦东新区川沙镇黄赵路310号',
            tips: ['Arrive before 7:00 AM at hotel early entrance gate', 'Knock out top 5 rides before standard crowd enters at 8:30'],
            offlineCached: true
          },
          {
            id: 'sh-d2-s2',
            dayNumber: 2,
            title: '米奇妙游童话书、花车巡游 & 奇梦之光城堡烟花秀',
            subtitle: 'Mickey\'s Storybook & 20:00 Fireworks',
            description: '下午在App预约14:00米奇妙游童话书演出；主街看迪士尼花车大巡游；晚间20:00在奇想花园提前50分钟占位欣赏震撼城堡夜光幻影烟花秀。',
            locationName: '奇幻童话城堡 (Enchanted Storybook Castle)',
            coordinates: { lat: 31.1442, lng: 121.6575 },
            timeSlot: '14:00 - 20:30',
            duration: '6.5 hrs',
            category: 'landmark',
            address: '上海迪士尼乐园 奇想花园',
            tips: ['World of Disney in Disneytown has the widest merchandise selection'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: 转场市区 · 南京路 & 外滩 (To City, Nanjing Rd & The Bund)',
        dateStr: '2026-11-26 (Wed)',
        summary: '角色早餐、入住市区万豪酒店、莱莱小笼、福和面馆、国际饭店蝴蝶酥 & 外滩观景台',
        stops: [
          {
            id: 'sh-d3-s1',
            dayNumber: 3,
            title: '入住上海雅居乐万豪侯爵酒店',
            subtitle: 'Shanghai Marriott Marquis City Centre',
            description: '迪士尼酒店角色早餐后退房，专车约50分钟抵达人民广场/南京路万豪酒店 (6座约¥221)。',
            locationName: '上海雅居乐万豪侯爵酒店',
            coordinates: { lat: 31.2355, lng: 121.4745 },
            timeSlot: '11:30',
            duration: 'Check-in',
            category: 'hotel',
            address: '黄浦区西藏中路555号 (近南京东路与人民广场)',
            tips: ['Centrally located within walking distance to top food and metro lines'],
            offlineCached: true
          },
          {
            id: 'sh-d3-s2',
            dayNumber: 3,
            title: '南京路美食漫步 & 外滩观景台夜景',
            subtitle: '莱莱小笼、福和面馆虾仁鳝丝面、国际饭店蝴蝶酥',
            description: '漫步天津路品尝必吃榜莱莱小笼、福和面馆；国际饭店买刚出炉脆香蝴蝶酥、ZX创趣场与泡泡玛特旗舰店。晚7点前抵达外滩观景台看浦东陆家嘴天际线亮灯。',
            locationName: '外滩观景台 (The Bund)',
            coordinates: { lat: 31.2402, lng: 121.4905 },
            timeSlot: '下午 - 晚上',
            duration: '5.0 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
            address: '黄浦区中山东一路 外滩观景平台',
            tips: ['Arrive before 19:00 to watch Shanghai Tower and Oriental Pearl light up'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Day 4: 豫园 & 城隍庙 (Yu Garden & City God Temple)',
        dateStr: '2026-11-27 (Thu)',
        summary: '九曲桥、南翔馒头店百年小笼、大壶春生煎、德兴菜馆 & 三号仓库',
        stops: [
          {
            id: 'sh-d4-s1',
            dayNumber: 4,
            title: '豫园老街、九曲桥 & 南翔馒头店',
            subtitle: 'Yuyuan Garden & Nanxiang Steamed Buns',
            description: '穿行明代古典江南园林与豫园老街商圈。七号门九曲桥旁品尝创立于1900年米其林必比登南翔馒头店鲜肉与蟹黄小笼包。',
            locationName: '豫园 (Yu Garden)',
            coordinates: { lat: 31.2272, lng: 121.4921 },
            timeSlot: '上午',
            duration: '3.5 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
            address: '黄浦区福佑路168号',
            tips: ['Gate 1 and Gate 6 second-floor walkways offer superb elevated photo spots'],
            offlineCached: true
          },
          {
            id: 'sh-d4-s2',
            dayNumber: 4,
            title: '三号仓库 Warehouse No.3 豫园新店晚餐',
            subtitle: '福佑路234号豫园1号门旁',
            description: '豫园1号门旁纯白现代美学建筑餐厅享用创意融合菜晚餐。',
            locationName: '三号仓库 (城隍庙豫园店)',
            coordinates: { lat: 23.2285, lng: 121.4912 },
            timeSlot: '17:30',
            duration: '2.0 hrs',
            category: 'dining',
            address: '黄浦区福佑路234号',
            tips: ['Highly popular aesthetic venue — reserve early'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Day 5: 静安 · 南京西路 (Jing\'an & West Nanjing Rd)',
        dateStr: '2026-11-28 (Fri)',
        summary: '星巴克烘焙工坊、LV巨轮、张园石库门、静安寺 & 人和馆米其林一星蟹粉捞饭',
        stops: [
          {
            id: 'sh-d5-s1',
            dayNumber: 5,
            title: '星巴克臻选烘焙工坊 & 张园石库门',
            subtitle: 'Starbucks Reserve Roastery & Zhang Garden',
            description: '打卡全球第三大星巴克烘焙工坊、LV巨轮艺术装置；漫步修缮一新的百年张园海派石库门建筑群与吴江路黄油与面包旗舰店。',
            locationName: '星巴克臻选上海烘焙工坊 (兴业太古汇)',
            coordinates: { lat: 31.2315, lng: 121.4602 },
            timeSlot: '上午',
            duration: '3.0 hrs',
            category: 'landmark',
            address: '静安区南京西路789号兴业太古汇',
            tips: ['Great architectural photos at Zhang Garden shikumen alleys'],
            offlineCached: true
          },
          {
            id: 'sh-d5-s2',
            dayNumber: 5,
            title: '静安寺 & 人和馆 (静安寺店) 米其林一星晚餐',
            subtitle: 'Jing\'an Temple & Michelin 1-Star Shanghainese Feast',
            description: '闹市中的金顶静安寺拍照打卡；愚园路逛BASDBAN面包店与PANE旗舰店；晚餐在人和馆品尝招牌浓郁蟹粉捞饭与本帮红烧肉。',
            locationName: '人和馆 (静安寺店)',
            coordinates: { lat: 31.2248, lng: 121.4455 },
            timeSlot: '17:30',
            duration: '2.0 hrs',
            category: 'dining',
            address: '静安区愚园路142号 (静安寺站步行190米)',
            tips: ['Michelin 1-star crab roe over rice is an absolute must-eat'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 6,
        title: 'Day 6: 淮海路 & 新天地 (Huaihai Rd & Xintiandi)',
        dateStr: '2026-11-29 (Sat)',
        summary: 'HAUS NOWHERE、Songmont山下有松、TX淮海年轻力中心 & 新天地时尚',
        stops: [
          {
            id: 'sh-d6-s1',
            dayNumber: 6,
            title: '淮海中路潮流街区 Citywalk',
            subtitle: 'HAUS NOWHERE, Songmont, FARMER BOB, TX淮海',
            description: '逛 Gentle Monster × Tamburins × Café Nudake 巨型未来概念店 HAUS NOWHERE、国风静奢皮具 Songmont、潮牌 MASONPRINCE 与 TX淮海。',
            locationName: 'HAUS NOWHERE (淮海中路店)',
            coordinates: { lat: 31.2205, lng: 121.4658 },
            timeSlot: '下午',
            duration: '4.0 hrs',
            category: 'activity',
            address: '黄浦区淮海中路798-812号1-4层',
            tips: ['Huge futuristic interactive retail art installations inside HAUS NOWHERE'],
            offlineCached: true
          },
          {
            id: 'sh-d6-s2',
            dayNumber: 6,
            title: '新天地时尚 & 蟹家宴全蟹宴晚餐',
            subtitle: 'New York Bagelous & Crab Feast',
            description: '打卡新天地纽约贝果博物馆与PAOPAO烘焙；晚间在SOHO复兴广场蟹叁寳·蟹家宴享用丰盛秋季蟹宴。',
            locationName: '新天地时尚 (Xintiandi)',
            coordinates: { lat: 31.2168, lng: 121.4748 },
            timeSlot: '晚上',
            duration: '2.5 hrs',
            category: 'dining',
            address: '黄浦区马当路388号SOHO复兴广场F1',
            tips: ['Xintiandi evening terrace ambiance is vibrant and stylish'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 7,
        title: 'Day 7: 武康路 & 安福路 (Wukang & Anfu Road)',
        dateStr: '2026-11-30 (Sun)',
        summary: '武康大楼、安福路RACBAR网红早午餐、明星潮牌店、乌中市集 & 白敬亭Goodbai',
        stops: [
          {
            id: 'sh-d7-s1',
            dayNumber: 7,
            title: '武康大楼地标 & 梧桐区 Citywalk',
            subtitle: 'Wukang Mansion & Plane-Tree Alleys',
            description: '上海最具代表性的法国文艺复兴风格诺曼底公寓武康大楼拍照打卡，品尝酷矿GELATO与Apoli Itabakery手作面包。',
            locationName: '武康大楼 (Wukang Mansion)',
            coordinates: { lat: 31.2052, lng: 121.4395 },
            timeSlot: '上午',
            duration: '2.5 hrs',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
            address: '徐汇区淮海中路1850号',
            tips: ['Signature photo angle from the crosswalk facing the prow of the mansion'],
            offlineCached: true
          },
          {
            id: 'sh-d7-s2',
            dayNumber: 7,
            title: '安福路潮流街区 & 乌中市集',
            subtitle: 'RACBAR, D.desirable, Goodbai, Juice CLOT',
            description: '品尝RACBAR法式可丽饼Brunch；逛王鹤棣D.desirable、白敬亭Goodbai、Edison Chen Juice CLOT潮流名店与Prada曾联名打造的乌中市集。',
            locationName: '安福路 (Anfu Road)',
            coordinates: { lat: 31.2135, lng: 121.4428 },
            timeSlot: '下午',
            duration: '3.5 hrs',
            category: 'activity',
            address: '徐汇区安福路318号 / 延庆路 / 巨鹿路',
            tips: ['Bijou octopus burger is another highly-rated lunch choice on Wuyuan Rd'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 8,
        title: 'Day 8: 自然博物馆 & 叙宴汉代主题宴 (Museum & Xu Yan Banquet)',
        dateStr: '2026-12-01 (Mon)',
        summary: '上海自然博物馆、很久以前羊肉串 & 叙宴汉代宫廷沉浸式晚宴',
        stops: [
          {
            id: 'sh-d8-s1',
            dayNumber: 8,
            title: '上海自然博物馆 (Shanghai Natural History Museum)',
            subtitle: '静安雕塑公园内',
            description: '酒店步行约15分钟。探索恐龙骨架化石、非洲大草原动物大迁徙全景标本与生命长河演化史，非常适合亲子互动。',
            locationName: '上海自然博物馆',
            coordinates: { lat: 31.2378, lng: 121.4589 },
            timeSlot: '上午',
            duration: '3.5 hrs',
            category: 'activity',
            address: '静安区北京西路510号 (静安雕塑公园内)',
            tips: ['Interactive paleontology exhibits are top-rated for kids'],
            offlineCached: true
          },
          {
            id: 'sh-d8-s2',
            dayNumber: 8,
            title: '叙宴 · 汉代宫廷沉浸式主题晚宴 (Xu Yan)',
            subtitle: 'Han Dynasty Themed Feast with Royal Performance',
            description: '静安区汶水路40号。换上精美汉服华服，一边品尝复刻汉代宫廷珍馐御宴，一边沉浸式观赏雅乐舞乐大戏。',
            locationName: '叙宴 (静安店)',
            coordinates: { lat: 31.2952, lng: 121.4468 },
            timeSlot: '18:00',
            duration: '2.5 hrs',
            category: 'dining',
            address: '静安区汶水路40号 (打车约25分钟)',
            tips: ['Book in advance via App / Trip.com — Han costume dress-up included'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 9,
        title: 'Day 9: 苏州水乡园林一日游 (Suzhou Day Trip)',
        dateStr: '2026-12-02 (Tue)',
        summary: '包车9座专车 (08:00出发) → 周庄古镇 → 拙政园 → 平江路古街',
        stops: [
          {
            id: 'sh-d9-s1',
            dayNumber: 9,
            title: '周庄中国第一水乡古镇',
            subtitle: 'Zhouzhuang Water Town',
            description: '08:00酒店专车出发。漫步双桥、张厅、沈厅，乘摇橹船穿行小桥流水枕水人家。',
            locationName: '周庄古镇 (Zhouzhuang)',
            coordinates: { lat: 31.1165, lng: 120.8525 },
            timeSlot: '09:30 AM',
            duration: '3.0 hrs',
            category: 'culture',
            address: '苏州市昆山市周庄镇全福路43号',
            tips: ['Private 9-seater car covers 10-12 hours ($566.06 package)'],
            offlineCached: true
          },
          {
            id: 'sh-d9-s2',
            dayNumber: 9,
            title: '拙政园 (世界文化遗产) & 平江路历史街区',
            subtitle: 'Humble Administrator\'s Garden & Pingjiang Road',
            description: '游览中国四大名园之首拙政园，感受山水萦绕、厅榭精美的江南园林意境；漫步平江路听苏州评弹、尝松鼠桂鱼与桂花鸡头米。',
            locationName: '拙政园 (Humble Administrator\'s Garden)',
            coordinates: { lat: 31.3255, lng: 120.6285 },
            timeSlot: '13:30',
            duration: '4.0 hrs',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
            address: '苏州市姑苏区东北街178号 / 平江路历史街区',
            tips: ['Take the electric canal boat or try live Pingtan storytelling over tea'],
            offlineCached: true
          }
        ]
      },
      {
        dayNumber: 10,
        title: 'Day 10: 告别上海 (Farewell Shanghai)',
        dateStr: '2026-12-03 (Wed)',
        summary: '万豪酒店退房、12:20专车赴浦东T1、MU545航班 (16:20) 返新加坡',
        stops: [
          {
            id: 'sh-d10-s1',
            dayNumber: 10,
            title: 'China Eastern MU545 航班飞返新加坡',
            subtitle: 'Shanghai Pudong (PVG) T1 → Singapore Changi (SIN)',
            description: '12:20退房专车赴浦东机场T1 (车程约1小时，6座约¥320)。搭乘16:20航班返回新加坡，圆满结束上海冬日梦幻之旅！',
            locationName: '上海浦东国际机场 T1',
            coordinates: { lat: 31.1443, lng: 121.8083 },
            timeSlot: '12:20 - 16:20',
            duration: '4.5 hrs',
            category: 'activity',
            address: '上海浦东国际机场 T1 航站楼',
            tips: ['Arrive 3 hours early for international check-in and duty-free shopping'],
            offlineCached: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. BATAM DAY TRIP · DBS GOVERNANCE & CONTROL (PAST TRIP 3)
  // =========================================================================
  {
    id: 'batam-day-trip-dbs',
    title: 'Batam Day Trip · DBS Governance & Control',
    subtitle: 'Team Outing · One-Day Escape (Singapore → Batam)',
    dateRange: '2026 • 1-Day Team Outing',
    travelersCount: 20,
    destination: 'Batam, Indonesia (巴淡岛)',
    regionCountry: 'Indonesia',
    isChinaRegion: false,
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    quote: '"Team Outing · One-Day Escape from the new Singapore Cruise Centre across to Harbour Bay, 70° Fahrenheit Koffie tour, Love Seafood Nagoya feast, Spa Central massage, and Nagoya Hill Mall."',
    center: { lat: 1.1534, lng: 104.0135 },
    zoom: 13,
    days: [
      {
        dayNumber: 1,
        title: 'The Day (🇸🇬 SG Time · 🇮🇩 Batam Time)',
        dateStr: '2026 Team Outing',
        summary: 'Gather at SCC → Horizon Fast Ferry → Harbour Bay → 70°F Koffie → Love Seafood → Spa Central → Nagoya Hill Mall → Ferry Home',
        stops: [
          {
            id: 'btm-s1',
            dayNumber: 1,
            title: 'Gather — Singapore Cruise Centre (NEW terminal)',
            subtitle: '5 HarbourFront Avenue (Walkway from MRT Exit B / VivoCity)',
            description: '🚨 New location! Old terminal inside HarbourFront Centre closed 15 Jul 2026. Ferries leave from Singapore Cruise Centre (5 HarbourFront Ave). Pass physical passport to Wei Xiong for group ticket collection.',
            locationName: 'Singapore Cruise Centre (5 HarbourFront Ave)',
            coordinates: { lat: 1.2642, lng: 103.8208 },
            timeSlot: '🇸🇬 8:00 AM (🇮🇩 7:00 AM)',
            duration: '55 min',
            category: 'activity',
            address: '5 HarbourFront Avenue, Singapore 098679',
            tips: [
              'Pass passport to Wei Xiong for group boarding tickets',
              'Luggage check-in closes 30 min before departure (8:40 AM SG)',
              'Submit Indonesia e-Arrival Card at allindonesia.imigrasi.go.id'
            ],
            offlineCached: true
          },
          {
            id: 'btm-s2',
            dayNumber: 1,
            title: 'Board Horizon Fast Ferry (Departs 9:10 AM SG)',
            subtitle: 'Departs 9:10 AM SG → Harbour Bay, Batam (~50 min)',
            description: 'Be at boarding gate by 8:55 AM sharp. Set watch back 1 hour once on board (Batam is GMT+7).',
            locationName: 'Horizon Fast Ferry Boarding Gate',
            coordinates: { lat: 1.2645, lng: 103.8212 },
            timeSlot: '🇸🇬 8:55 AM (🇮🇩 7:55 AM)',
            duration: '50 min crossing',
            category: 'activity',
            address: 'Singapore Cruise Centre Ferry Berths',
            tips: ['Set your phone or watch back 1 hour — Batam is on GMT+7'],
            offlineCached: true
          },
          {
            id: 'btm-s3',
            dayNumber: 1,
            title: 'Arrive — Harbour Bay Terminal, Batam',
            subtitle: 'Batu Ampar, Batam (Crossing ~50 min)',
            description: 'Pass immigration via auto-gates (ASEAN passports, age 14+). We have 2 assigned coaches waiting outside — check bus assignment before boarding.',
            locationName: 'Harbour Bay International Ferry Terminal',
            coordinates: { lat: 1.1534, lng: 104.0045 },
            timeSlot: '🇮🇩 ~9:00–9:15 AM (🇸🇬 10:00 AM)',
            duration: '45 min',
            category: 'landmark',
            address: 'Jl. Duyung, Komplek Harbour Bay, Batu Ampar, Batam',
            tips: [
              'Use electronic auto-gate with e-Arrival QR code',
              'We have 2 coaches — do not all pile onto the same bus!'
            ],
            offlineCached: true
          },
          {
            id: 'btm-s4',
            dayNumber: 1,
            title: '70° Fahrenheit Koffie — Factory Tour',
            subtitle: 'Golden City, Bengkong Laut (~2 hrs)',
            description: 'Watch coffee beans selection, roasting, and packaging through glass panels with free tastings (try the iced coconut coffee and luwak coffee).',
            locationName: '70° Fahrenheit Koffie Batam',
            coordinates: { lat: 1.1578, lng: 104.0375 },
            timeSlot: '🇮🇩 10:00 AM – 12:00 PM',
            duration: '2.0 hrs',
            category: 'dining',
            imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            address: 'Komp. Golden City Blok A No.1, Bengkong Laut, Batam',
            tips: ['Try iced coffee with coconut cream and luwak coffee tastings'],
            offlineCached: true
          },
          {
            id: 'btm-s5',
            dayNumber: 1,
            title: 'Lunch — Love Seafood, Nagoya (2-hr Relaxed Feast)',
            subtitle: 'Jalan Teuku Umar (Nagoya branch, 2-min from Nagoya Hill)',
            description: 'Relaxed 2-hour team seafood lunch. Crowd favorites: steamed garlic flower crab, butter baby lobster, gong gong with green-chilli dip, sambal kangkong.',
            locationName: 'Love Seafood Nagoya',
            coordinates: { lat: 1.1448, lng: 104.0152 },
            timeSlot: '🇮🇩 12:15 – 2:15 PM',
            duration: '2.0 hrs',
            category: 'dining',
            imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
            address: 'Komp. Seraya Mas (168 Foodcourt), Jalan Teuku Umar, Nagoya, Batam',
            tips: ['Our booking is at the NAGOYA branch — verify with coach driver!'],
            offlineCached: true
          },
          {
            id: 'btm-s6',
            dayNumber: 1,
            title: 'Massage — Spa Central, Nagoya (1-hr Session)',
            subtitle: 'Ruko Nagoya Hill Blok R4 No. D6-7, Jl. Imam Bonjol',
            description: '1-hour rejuvenating massage starting 3:30 PM Batam time to melt the quarter\'s stress away. Located along the spa street row, 2-3 min walk from mall.',
            locationName: 'Spa Central Nagoya',
            coordinates: { lat: 1.1435, lng: 104.0142 },
            timeSlot: '🇮🇩 3:30 – 4:30 PM',
            duration: '1.0 hr',
            category: 'activity',
            address: 'Ruko Nagoya Hill Blok R4 No. D6-7, Jl. Imam Bonjol, Batam',
            tips: ['Buffer after lunch for relaxing stroll over and massage check-in'],
            offlineCached: true
          },
          {
            id: 'btm-s7',
            dayNumber: 1,
            title: 'Free & Easy — Nagoya Hill Shopping Mall',
            subtitle: 'Beside Spa Central (Kopi, Kueh Lapis & Souvenirs)',
            description: 'Grab snacks or early dinner (no dinner catered tonight). Pick up famous Batam kueh lapis, crackers, and Indonesian snacks.',
            locationName: 'Nagoya Hill Shopping Mall',
            coordinates: { lat: 1.1440, lng: 104.0148 },
            timeSlot: '🇮🇩 4:30 – 5:30 PM',
            duration: '1.0 hr',
            category: 'activity',
            address: 'Jl. Teuku Umar, Lubuk Baja, Batam',
            tips: ['Both coaches depart mall promptly at 5:30 PM Batam time'],
            offlineCached: true
          },
          {
            id: 'btm-s8',
            dayNumber: 1,
            title: 'Harbour Bay Terminal → Ferry Home to Singapore',
            subtitle: 'Departs 7:15 PM Batam (8:15 PM SG) → Singapore Cruise Centre',
            description: 'Reach terminal before 6:00 PM Batam time. Submit SG Arrival Card on MyICA app before boarding. Arrive Singapore Cruise Centre ~9:05–9:15 PM SG time.',
            locationName: 'Harbour Bay Ferry Terminal',
            coordinates: { lat: 1.1534, lng: 104.0045 },
            timeSlot: '🇮🇩 before 6:00 PM (Departs 7:15 PM)',
            duration: '50 min crossing',
            category: 'activity',
            address: 'Harbour Bay International Ferry Terminal, Batam',
            tips: [
              'Submit SG Arrival Card via MyICA app before boarding',
              'Set watch forward 1 hour upon arriving in Singapore'
            ],
            offlineCached: true
          }
        ]
      }
    ]
  }
];
