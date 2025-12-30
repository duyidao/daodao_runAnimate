import React from 'react';

interface TitleLayerProps {
  className?: string,
  title: string,
  element: React.ComponentType,
  props?: {
    size?: number,
    text?: string,
    color?: string,
  }
}

const TitleLayer: React.FC<TitleLayerProps> = ({ title, element: Element, props = {}, className }) => {
  console.log(className);
  
  const { size = 12, text = 'xs', color = 'gray-500' } = props; // 默认大小为3.5，默认文本大小为xs
  return (
    <h2 className={`${className} flex items-center text-${text} font-bold text-${color} uppercase mb-2 flex items-center gap-2`}>
      <Element size={size} />
      <span>{ title }</span>
    </h2>
  )
}

export default TitleLayer;