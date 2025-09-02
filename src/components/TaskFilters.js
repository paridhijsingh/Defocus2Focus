import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Chip, Card, Title, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

/**
 * TaskFilters Component - Filter and sort controls for tasks
 * Features: Category filters, status filters, sorting options
 */
const TaskFilters = ({
  activeFilter = 'all',
  onFilterChange,
  sortBy = 'created',
  onSortChange,
  sortOrder = 'desc',
  onSortOrderChange,
  categories = [],
  showSortOptions = true,
}) => {
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'pending', label: 'Pending', icon: 'clock' },
    { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
    { id: 'overdue', label: 'Overdue', icon: 'alert-circle' },
    { id: 'due_today', label: 'Due Today', icon: 'today' },
    { id: 'high_priority', label: 'High Priority', icon: 'flag' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'created', label: 'Created Date', icon: 'calendar' },
    { id: 'priority', label: 'Priority', icon: 'flag' },
    { id: 'due_date', label: 'Due Date', icon: 'time' },
    { id: 'alphabetical', label: 'Alphabetical', icon: 'text' },
  ];

  // Get filter icon color
  const getFilterIconColor = (filterId) => {
    if (activeFilter === filterId) return '#ffffff';
    
    switch (filterId) {
      case 'overdue': return '#ef4444';
      case 'due_today': return '#f59e0b';
      case 'high_priority': return '#ef4444';
      case 'completed': return '#10b981';
      case 'pending': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Get filter background color
  const getFilterBackgroundColor = (filterId) => {
    if (activeFilter === filterId) {
      switch (filterId) {
        case 'overdue': return '#ef4444';
        case 'due_today': return '#f59e0b';
        case 'high_priority': return '#ef4444';
        case 'completed': return '#10b981';
        case 'pending': return '#3b82f6';
        default: return '#3b82f6';
      }
    }
    return '#ffffff';
  };

  // Render filter chip
  const renderFilterChip = (filter) => (
    <Chip
      key={filter.id}
      selected={activeFilter === filter.id}
      onPress={() => onFilterChange(filter.id)}
      style={[
        styles.filterChip,
        { backgroundColor: getFilterBackgroundColor(filter.id) }
      ]}
      textStyle={{
        color: activeFilter === filter.id ? '#ffffff' : '#374151',
        fontSize: 12,
      }}
      icon={filter.icon}
      compact
    >
      {filter.label}
    </Chip>
  );

  // Render category filter chip
  const renderCategoryChip = (category) => (
    <Chip
      key={category.id}
      selected={activeFilter === category.id}
      onPress={() => onFilterChange(category.id)}
      style={[
        styles.filterChip,
        { backgroundColor: activeFilter === category.id ? category.color : '#ffffff' }
      ]}
      textStyle={{
        color: activeFilter === category.id ? '#ffffff' : category.color,
        fontSize: 12,
      }}
      icon={category.icon}
      compact
    >
      {category.name}
    </Chip>
  );

  // Render sort option
  const renderSortOption = (option) => (
    <Chip
      key={option.id}
      selected={sortBy === option.id}
      onPress={() => onSortChange(option.id)}
      style={[
        styles.sortChip,
        { backgroundColor: sortBy === option.id ? '#3b82f6' : '#ffffff' }
      ]}
      textStyle={{
        color: sortBy === option.id ? '#ffffff' : '#374151',
        fontSize: 12,
      }}
      icon={option.icon}
      compact
    >
      {option.label}
    </Chip>
  );

  return (
    <View style={styles.container}>
      {/* Main Filters */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Filters</Title>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {filterOptions.map(renderFilterChip)}
            {categories.map(renderCategoryChip)}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Sort Options */}
      {showSortOptions && (
        <Card style={styles.sortCard}>
          <Card.Content>
            <View style={styles.sortHeader}>
              <Title style={styles.sectionTitle}>Sort By</Title>
              <IconButton
                icon={sortOrder === 'desc' ? 'sort-descending' : 'sort-ascending'}
                size={20}
                onPress={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
                iconColor="#6b7280"
              />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortScrollContainer}
            >
              {sortOptions.map(renderSortOption)}
            </ScrollView>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  filterCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  sortCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  filterScrollContainer: {
    paddingRight: 16,
  },
  sortScrollContainer: {
    paddingRight: 16,
  },
  filterChip: {
    marginRight: 8,
    height: 32,
  },
  sortChip: {
    marginRight: 8,
    height: 32,
  },
  sortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TaskFilters;
