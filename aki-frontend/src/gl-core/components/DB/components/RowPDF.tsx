// abgeschottet-ki/aki-frontend/src/gl-core/components/DB/components/RowPDF.tsx
'use client';

/*  
  RowPDF.tsx  
  This component displays a single PDF entry as a clickable list item.  
  It shows a PDF icon, the entry’s label, and a truncated preview of its text.  
  When clicked, it navigates to the detail page for that PDF at `/ki/[slug]`.  
*/

import * as React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Icon } from '../../../../gl-core';

export default function RowPDF({ row }: { row: any }) {
  const {
    id,
    label = '(no label)',
    text = '(no text)',
    slug = 'no-slug',
  } = row;

  const router = useRouter();

  // truncate text to 100 chars with ellipsis
  const truncatedText =
    typeof text === 'string' && text.length > 100
      ? text.substring(0, 100) + '…'
      : text;

  const handleClick = () => {
    if (slug) {
      router.push(`/ki/${slug}`);
    }
  };

  return (
    <ListItemButton 
      key={id} 
      divider 
      onClick={handleClick}
    >
      <ListItemIcon>
        <Icon icon="pdf" color="primary" />
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={truncatedText}
      />
    </ListItemButton>
  );
}
