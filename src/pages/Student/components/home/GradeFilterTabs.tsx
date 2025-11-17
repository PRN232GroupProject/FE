import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

export const gradeTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: '13', label: 'Ôn thi ĐH' },
];

interface GradeFilterTabsProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

const GradeFilterTabs: React.FC<GradeFilterTabsProps> = ({ selectedGrade, onGradeChange }) => {
  return (
    <Paper elevation={2} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
      <Tabs
        value={selectedGrade}
        onChange={(_, newValue) => onGradeChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            py: 2,
            fontSize: '0.9rem',
            fontWeight: 600,
          },
        }}
      >
        {gradeTabs.map((tab) => (
          <Tab
            key={tab.value}
            icon={<SchoolIcon fontSize="small" />}
            iconPosition="start"
            label={tab.label}
            value={tab.value.toString()}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default GradeFilterTabs;