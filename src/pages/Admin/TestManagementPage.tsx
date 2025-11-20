import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { testService } from '../../services/features/test.service';
import type { ITestResponse } from '../../types/test.types';

import TestFilter from './components/test-management/TestFilter';
import TestTable from './components/test-management/TestTable';
import TestDetailDialog from './components/test-management/TestDetailDialog';

const TestManagementPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTest, setSelectedTest] = useState<ITestResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: () => testService.getAllTests(),
  });

  const handleViewDetail = async (test: ITestResponse) => {
    setIsLoadingDetail(true);
    try {
      const detailRes = await testService.getTestById(test.id);
      setSelectedTest(detailRes.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết bài kiểm tra", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // SỬA TẠI ĐÂY: Sort dữ liệu ngay khi lấy về
  const tests = useMemo(() => {
    const rawData = (response?.data || []) as ITestResponse[];
    return [...rawData].sort((a, b) => b.id - a.id); // ID lớn nhất (mới nhất) lên đầu
  }, [response]);

  const processedTests = useMemo(() => {
    return tests.filter(t => {
      const matchName = t.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchName && matchType;
    });
  }, [tests, search, typeFilter]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Quản lý Bài kiểm tra
      </Typography>

      <TestFilter search={search} setSearch={setSearch} typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
      
      <TestTable tests={processedTests} onViewDetail={handleViewDetail} />

      {isLoadingDetail && <LoadingSpinner size={30} minHeight="100px" />}
      
      <TestDetailDialog test={selectedTest} onClose={() => setSelectedTest(null)} />
    </Box>
  );
};
export default TestManagementPage;