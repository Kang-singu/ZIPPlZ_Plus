import { useCallback, useEffect, useRef, useState } from 'react';

import axios from 'axios';

interface Props {
  type: string;
}
export default function MaterialList({ type }: Props) {
  const [items, setItems] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      loadMoreItems();
    }
  }, [items]);

  const fetchItems = async () => {
    if (type === '바닥') {
      const response = await axios.get(
        'https://zipplz.site/api/materials?category=floor',
        {
          withCredentials: true,
        }
      );
      const data = await response.data.data;
      const images = data.data.map((item: any) => item.img);
      setItems(images);
    } else {
      const response = await axios.get(
        'https://zipplz.site/api/materials?category=wall',
        {
          withCredentials: true,
        }
      );
      const data = await response.data.data;
      const images = data.map((item: any) => item.img);
      setItems(images);
    }
  };
  const loadMoreItems = () => {
    const nextItems: string[] = items.slice(
      visibleItems.length,
      visibleItems.length + itemsPerPage
    );
    setVisibleItems((prev: string[]) => [...prev, ...nextItems]);
    if (visibleItems.length + nextItems.length >= items.length) {
      setHasMore(false);
    }
  };
  const lastItemRef = useCallback(
    (node: HTMLLIElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, visibleItems]
  );

  return (
    <>
      <div className="flex w-full space-x-4 flex-nowrap">
        <ul className="w-full">
          {visibleItems.map((img, index) => (
            <li
              key={index}
              ref={index === items.length - 1 ? lastItemRef : null}
              className="w-full bg-gray-100 border cursor-pointer aspect-square hover:bg-zp-light-gray"
            >
              <img src={img} className="object-cover w-full aspect-square" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
