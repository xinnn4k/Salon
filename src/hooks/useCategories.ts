import { FaCut, FaMale, FaFemale, FaUserTie, FaMagic, FaEye, FaPalette, FaWind } from 'react-icons/fa';
import { IconType } from 'react-icons';
import childHaircut from '../assets/sub/child_haircut.png';
import beardShave from '../assets/sub/beard_shaving.png';
import coldDrying from '../assets/sub/Cold_drying.png';
import edgeBeard from '../assets/sub/edge_beard.png';
import eventHairstyle from '../assets/sub/event_hairstyle.png';
import eyebrowShape from '../assets/sub/Eyebrow_shaping.png';
import eyelashExtension from '../assets/sub/Eyelash_extensions.png';
import eyelashCurled from '../assets/sub/Eyelashes_curled.png';
import hairDye from '../assets/sub/hair_dye.png';
import hairHeat from '../assets/sub/Hair_heat.png';
import hairRestore from '../assets/sub/Hair_restoration.png';
import longHair from '../assets/sub/long_haircut.png';
import manHaircut from '../assets/sub/man_haircut.png';
import ombrePaint from '../assets/sub/Ombre_paint.png';
import scalpTreat from '../assets/sub/Scalp_treatment.png';
import shortHair from '../assets/sub/short_haircut.png';
import simpleHair from '../assets/sub/simple_haircut.png';
import specialHair from '../assets/sub/special_haircut.png';
import specialTech from '../assets/sub/Special_tech.png';
import warmDrying from '../assets/sub/warm_drying.png';
import skinCare from '../assets/sub/Skin_care.png';
import handCare from '../assets/sub/Hand_care.png';
import massage from '../assets/sub/massage.png';



type Subcategory = {
  id: string;
  name: string;
  imageUrl: string;
}

type Category = {
  id: string;
  name: string;
  icon: IconType;
  subcategories: Subcategory[];
};

export const useCategories = (): Category[] => {
  const popularCategories: Category[] = [
    { 
      id: '1', 
      name: 'Үсчин', 
      icon: FaCut,
      subcategories: [
        { id: '1-1', name: 'Хүүхдийн үс засалт', imageUrl: childHaircut},
        { id: '1-2', name: 'Энгийн засалт', imageUrl: simpleHair },
        { id: '1-3', name: 'Онцгой арга хэмжээний засалт', imageUrl: eventHairstyle },
      ]
    },
    { 
      id: '2', 
      name: 'Эрэгтэй үсчин', 
      icon: FaMale,
      subcategories: [
        { id: '2-1', name: 'Сахал хусалт', imageUrl: beardShave },
        { id: '2-2', name: 'Хусалт ба тэгшилгээ', imageUrl: edgeBeard },
        { id: '2-3', name: 'Эрэгтэй үс засалт', imageUrl: manHaircut },
      ]
    },
    { 
      id: '3', 
      name: 'Эмэгтэй үсчин', 
      icon: FaFemale,
      subcategories: [
        { id: '3-1', name: 'Богино үс засалт', imageUrl: shortHair },
        { id: '3-2', name: 'Урт үс засалт', imageUrl: longHair },
        { id: '3-3', name: 'Онцгой үс засалт', imageUrl: specialHair },
      ]
    },
    { 
      id: '4', 
      name: 'Гоо сайханы салон', 
      icon: FaUserTie,
      subcategories: [
        { id: '4-1', name: 'Арьс арчилгаа', imageUrl: skinCare },
        { id: '4-2', name: 'Массаж', imageUrl: massage },
        { id: '4-3', name: 'Гарын арчилгаа', imageUrl: handCare },
      ]
    },
    { 
      id: '5', 
      name: 'Үсний эмчилгээ', 
      icon: FaMagic,
      subcategories: [
        { id: '5-1', name: 'Хуйхны эмчилгээ', imageUrl: scalpTreat },
        { id: '5-2', name: 'Үс нөхөн сэргээх', imageUrl: hairRestore },
        { id: '5-3', name: 'Үс халаалт эмчилгээ', imageUrl: hairHeat },
      ]
    },
    { 
      id: '6', 
      name: 'Хөмсөг, сормуус', 
      icon: FaEye,
      subcategories: [
        { id: '6-1', name: 'Хөмсөг засалт', imageUrl: eyebrowShape },
        { id: '6-2', name: 'Сормуус сунгалт', imageUrl: eyelashExtension },
        { id: '6-3', name: 'Сормуус буржгар', imageUrl: eyelashCurled },
      ]
    },
    { 
      id: '7', 
      name: 'Үс будах', 
      icon: FaPalette,
      subcategories: [
        { id: '7-1', name: 'Бүх үс будах', imageUrl: hairDye },
        { id: '7-2', name: 'Омбре будаг', imageUrl: ombrePaint },
        { id: '7-3', name: 'Тусгай техник будаг', imageUrl: specialTech },
      ]
    },
    { 
      id: '8', 
      name: 'Үс хатаах', 
      icon: FaWind,
      subcategories: [
        { id: '8-1', name: 'Хүйтэн хатаалт', imageUrl: coldDrying },
        { id: '8-2', name: 'Халуун хатаалт', imageUrl: warmDrying },
      ]
    },
  ];

  return popularCategories;
};
