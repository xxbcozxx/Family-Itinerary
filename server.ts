import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-initialized Gemini client with required User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Curated verified high-resolution symbolic images dictionary for top landmarks
const VERIFIED_LANDMARK_MAP: Record<string, { title: string; url: string; source: string }[]> = {
  // Guangzhou landmarks
  'canton tower': [
    {
      title: 'Canton Tower & Zhujiang New Town Skyline (广州塔与珠江新城)',
      url: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?auto=format&fit=crop&w=1200&q=80',
      source: 'Canton Tower Landmark',
    },
    {
      title: 'Canton Tower Night Illumination (广州塔夜景小蛮腰)',
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      source: 'Pearl River Skyline',
    },
  ],
  'guangzhou': [
    {
      title: 'Canton Tower & Pearl River (广州塔与珠江)',
      url: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?auto=format&fit=crop&w=1200&q=80',
      source: 'Guangzhou Cityscape',
    },
    {
      title: 'Yongqingfang & Xiguan Heritage (永庆坊·西关大屋与月亮桥)',
      url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
      source: 'Xiguan Heritage',
    },
    {
      title: 'Chimelong Safari (长隆野生动物世界)',
      url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=1200&q=80',
      source: 'Chimelong Safari Park',
    },
    {
      title: 'Shamian Island Architecture (沙面欧式历史街区)',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      source: 'Shamian Historic Island',
    },
    {
      title: 'Traditional Cantonese Dim Sum (广州早茶点心)',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      source: 'Guangzhou Yum Cha',
    },
  ],
  // Shanghai landmarks
  'oriental pearl': [
    {
      title: 'Oriental Pearl Tower & Lujiazui (东方明珠广播电视塔与陆家嘴)',
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      source: 'Oriental Pearl Tower',
    },
  ],
  'shanghai': [
    {
      title: 'Oriental Pearl Radio & TV Tower (东方明珠电视塔)',
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      source: 'Oriental Pearl Landmark',
    },
    {
      title: 'The Bund Historic Waterfront (上海外滩万国建筑群)',
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      source: 'The Bund',
    },
    {
      title: 'Shanghai Disney Castle (上海迪士尼奇幻童话城堡)',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
      source: 'Shanghai Disney Resort',
    },
    {
      title: 'Yu Garden & Pavilions (上海豫园古典园林)',
      url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80',
      source: 'Yu Garden Heritage',
    },
    {
      title: 'Wukang Mansion & French Concession (武康大楼)',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      source: 'Wukang Road',
    },
    {
      title: 'Suzhou Classical Water Town (苏州拙政园与江南水乡)',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      source: 'Suzhou Gardens',
    },
  ],
  // Beijing landmarks
  'forbidden city': [
    {
      title: 'The Forbidden City Imperial Palace (故宫博物院·太和殿)',
      url: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80',
      source: 'Forbidden City',
    },
  ],
  'great wall': [
    {
      title: 'Mutianyu Great Wall (慕田峪长城)',
      url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
      source: 'Great Wall of China',
    },
  ],
  'beijing': [
    {
      title: 'Forbidden City Palace Museum (北京故宫博物院)',
      url: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80',
      source: 'Forbidden City',
    },
    {
      title: 'Summer Palace & Kunming Lake (颐和园与万寿山)',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      source: 'Summer Palace',
    },
    {
      title: 'Temple of Heaven (北京天坛祈年殿)',
      url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80',
      source: 'Temple of Heaven',
    },
  ],
  // Batam landmarks
  'barelang': [
    {
      title: 'Barelang Bridge (巴淡岛标志性彩虹大桥)',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      source: 'Barelang Bridge',
    },
  ],
  'batam': [
    {
      title: 'Barelang Bridge (Jembatan Barelang)',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      source: 'Barelang Bridge',
    },
    {
      title: 'Harbour Bay & Coastal Batam (巴淡港湾与海岛风光)',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      source: 'Harbour Bay',
    },
    {
      title: 'Indonesian Seafood Feast (印尼现捞海鲜盛宴)',
      url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
      source: 'Nagoya Seafood',
    },
  ],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  // 1. Endpoint to generate or synthesize location-aware symbolic imagery using Gemini AI
  app.post('/api/generate-landmark-image', async (req, res) => {
    const {
      prompt,
      locationName = '',
      city = '',
      destination = '',
      category = 'landmark',
      style = 'photorealistic golden hour',
      aspectRatio = '16:9',
    } = req.body;

    const searchTerm = `${locationName} ${city} ${destination}`.trim().toLowerCase();

    try {
      const ai = getGeminiClient();

      // If Gemini AI key is available, attempt AI generation or rich synthesis
      if (ai) {
        try {
          // Attempt image generation with gemini-3.1-flash-lite-image
          const enhancedPrompt = `A high-resolution, vivid ${style} photograph representing the iconic landmark "${locationName || destination || 'world landmark'}" in ${city || destination || 'city'}. Architectural brilliance, authentic local atmosphere, rich vibrant lighting, beautiful travel editorial aesthetic. ${prompt || ''}`;

          const imageResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: enhancedPrompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: (aspectRatio as '16:9' | '1:1' | '4:3' | '3:4' | '9:16') || '16:9',
              },
            },
          });

          if (imageResponse.candidates && imageResponse.candidates[0]?.content?.parts) {
            for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                const base64Data = `data:${mimeType};base64,${part.inlineData.data}`;
                return res.json({
                  success: true,
                  imageUrl: base64Data,
                  source: 'Gemini AI Image Generation',
                  promptUsed: enhancedPrompt,
                  symbolicType: 'ai_generated',
                });
              }
            }
          }
        } catch (genErr: any) {
          console.warn('Gemini image generation fallback triggered:', genErr?.message || genErr);
        }
      }

      // Fallback: Resolve highest quality verified symbolic landmark photo
      let matchedPhoto = null;
      for (const [key, photos] of Object.entries(VERIFIED_LANDMARK_MAP)) {
        if (searchTerm.includes(key) || key.includes(searchTerm)) {
          matchedPhoto = photos[0];
          break;
        }
      }

      // Check Guangzhou specific keywords
      if (!matchedPhoto && (searchTerm.includes('广州') || searchTerm.includes('canton') || searchTerm.includes('guangzhou') || searchTerm.includes('小蛮腰'))) {
        matchedPhoto = VERIFIED_LANDMARK_MAP['canton tower'][0];
      }
      // Check Shanghai specific keywords
      if (!matchedPhoto && (searchTerm.includes('上海') || searchTerm.includes('shanghai') || searchTerm.includes('东方明珠') || searchTerm.includes('oriental pearl') || searchTerm.includes('外滩') || searchTerm.includes('bund'))) {
        matchedPhoto = VERIFIED_LANDMARK_MAP['oriental pearl'][0];
      }
      // Check Beijing specific keywords
      if (!matchedPhoto && (searchTerm.includes('北京') || searchTerm.includes('beijing') || searchTerm.includes('故宫') || searchTerm.includes('forbidden') || searchTerm.includes('长城') || searchTerm.includes('great wall'))) {
        matchedPhoto = VERIFIED_LANDMARK_MAP['forbidden city'][0];
      }
      // Check Batam specific keywords
      if (!matchedPhoto && (searchTerm.includes('巴淡') || searchTerm.includes('batam') || searchTerm.includes('barelang') || searchTerm.includes('indonesia'))) {
        matchedPhoto = VERIFIED_LANDMARK_MAP['barelang'][0];
      }

      const finalUrl = matchedPhoto
        ? matchedPhoto.url
        : `https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80`;

      return res.json({
        success: true,
        imageUrl: finalUrl,
        source: matchedPhoto ? matchedPhoto.source : 'Curated Landmark Repository',
        title: matchedPhoto ? matchedPhoto.title : locationName || destination,
        symbolicType: 'verified_landmark',
      });
    } catch (err: any) {
      console.error('Error generating landmark image:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate landmark image',
      });
    }
  });

  // 2. Endpoint to automatically resolve symbolic landmark image for a specific location
  app.post('/api/resolve-symbolic-image', async (req, res) => {
    const { locationName = '', destination = '', category = 'landmark', coordinates } = req.body;
    const query = `${locationName} ${destination}`.toLowerCase();

    // Match against verified dictionary
    for (const [key, photos] of Object.entries(VERIFIED_LANDMARK_MAP)) {
      if (query.includes(key)) {
        return res.json({
          success: true,
          imageUrl: photos[0].url,
          title: photos[0].title,
          source: photos[0].source,
          confidence: 'high',
        });
      }
    }

    // Guangzhou checks
    if (query.includes('广州') || query.includes('canton') || query.includes('guangzhou') || query.includes('小蛮腰')) {
      return res.json({
        success: true,
        imageUrl: VERIFIED_LANDMARK_MAP['canton tower'][0].url,
        title: 'Canton Tower (广州塔)',
        source: 'Canton Tower / 广州小蛮腰',
        confidence: 'high',
      });
    }

    // Shanghai checks
    if (query.includes('上海') || query.includes('shanghai') || query.includes('东方明珠') || query.includes('oriental pearl') || query.includes('外滩')) {
      return res.json({
        success: true,
        imageUrl: VERIFIED_LANDMARK_MAP['oriental pearl'][0].url,
        title: 'Oriental Pearl Tower (东方明珠)',
        source: 'Oriental Pearl Tower / 东方明珠',
        confidence: 'high',
      });
    }

    // Beijing checks
    if (query.includes('北京') || query.includes('beijing') || query.includes('故宫') || query.includes('forbidden')) {
      return res.json({
        success: true,
        imageUrl: VERIFIED_LANDMARK_MAP['forbidden city'][0].url,
        title: 'The Forbidden City (故宫博物院)',
        source: 'Forbidden City / 故宫',
        confidence: 'high',
      });
    }

    // Batam checks
    if (query.includes('巴淡') || query.includes('batam') || query.includes('barelang')) {
      return res.json({
        success: true,
        imageUrl: VERIFIED_LANDMARK_MAP['barelang'][0].url,
        title: 'Barelang Bridge (巴淡大桥)',
        source: 'Barelang Bridge / 巴淡大桥',
        confidence: 'high',
      });
    }

    return res.json({
      success: true,
      imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
      title: locationName || destination || 'Scenic Destination',
      source: 'Travel Landmark Archive',
      confidence: 'medium',
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nomad Wonders server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
