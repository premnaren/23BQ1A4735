import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  MenuItem, 
  AppBar, 
  Toolbar, 
  Paper,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  List
} from '@mui/material'
import { Log } from '../../logging_middleware/logger'
import { getTopPriorityNotifications } from './utils/prioritySort'
import type { RawNotification } from './utils/prioritySort'

function App() {
  const [currentTab, setCurrentTab] = useState(0)
  const [allNotifications, setAllNotifications] = useState<RawNotification[]>([])
  const [priorityNotifications, setPriorityNotifications] = useState<RawNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All')
  const [viewedIds, setViewedIds] = useState<string[]>([])

  useEffect(() => {
    Log("frontend", "info", "page", "Campus notifications microservice dashboard initialized")
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api-gateway/evaluation-service/notifications")
      const data = await response.json()
      const rawList: RawNotification[] = data.notifications || []
      
      setAllNotifications(rawList)
      setPriorityNotifications(getTopPriorityNotifications(rawList, 10))
      
      Log("frontend", "info", "api", `Successfully retrieved ${rawList.length} notifications from evaluation server`)
    } catch (error) {
      Log("frontend", "error", "api", "Failed to clear network connection to notification resource endpoint")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
    Log("frontend", "info", "component", `User swiped application dashboard context view to tab index ${newValue}`)
  }

  const handleNotificationClick = (id: string) => {
    if (!viewedIds.includes(id)) {
      const updatedViewed = [...viewedIds, id]
      setViewedIds(updatedViewed)
      Log("frontend", "info", "state", `Notification marked as read: ${id}`)
    }
  }

  const filteredNotifications = filterType === 'All' 
    ? allNotifications 
    : allNotifications.filter(n => n.Type.toLowerCase() === filterType.toLowerCase())

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#2e7d32' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Campus Hub Notifications Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            indicatorColor="primary" 
            textColor="primary" 
            centered
          >
            <Tab label="Priority Inbox (Top 10)" />
            <Tab label="All Bulletins Feed" />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Box>
            {currentTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                  High Priority Updates
                </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 0 }}>
                  {priorityNotifications.map((item) => {
                    const isRead = viewedIds.includes(item.ID)
                    return (
                      <Card 
                        key={item.ID} 
                        onClick={() => handleNotificationClick(item.ID)}
                        sx={{ 
                          cursor: 'pointer',
                          borderLeft: isRead ? '6px solid #9e9e9e' : '6px solid #d32f2f',
                          opacity: isRead ? 0.75 : 1,
                          transition: '0.2s',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: isRead ? 'normal' : 'bold' }}>
                              {item.Message}
                            </Typography>
                            <Box sx={{ fontSize: '0.75rem', fontWeight: 'bold', px: 1, py: 0.5, borderRadius: 1, bgcolor: '#ffebee', color: '#c62828' }}>
                              {item.Type}
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Dispatched: {new Date(item.Timestamp).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  })}
                </List>
              </Box>
            )}

            {currentTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Archive Stream
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="filter-type-label">Category</InputLabel>
                    <Select
                      labelId="filter-type-label"
                      id="filter-type"
                      value={filterType}
                      label="Category"
                      onChange={(e) => {
                        setFilterType(e.target.value)
                        Log("frontend", "info", "state", `Filtered general feed stream by class: ${e.target.value}`)
                      }}
                    >
                      <MenuItem value="All">All Bulletins</MenuItem>
                      <MenuItem value="Placement">Placement</MenuItem>
                      <MenuItem value="Result">Result</MenuItem>
                      <MenuItem value="Event">Event</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 0 }}>
                  {filteredNotifications.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No matching records found in this category slot.
                    </Paper>
                  ) : (
                    filteredNotifications.map((item) => {
                      const isRead = viewedIds.includes(item.ID)
                      return (
                        <Card 
                          key={item.ID} 
                          onClick={() => handleNotificationClick(item.ID)}
                          sx={{ 
                            cursor: 'pointer',
                            borderLeft: isRead ? '6px solid #b0bec5' : '6px solid #2e7d32',
                            opacity: isRead ? 0.75 : 1,
                            '&:hover': { boxShadow: 2 }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: isRead ? 'normal' : 'medium' }}>
                                {item.Message}
                              </Typography>
                              <Box 
                                sx={{ 
                                  fontSize: '0.72rem', 
                                  fontWeight: 'bold', 
                                  px: 1, 
                                  py: 0.4, 
                                  borderRadius: 1, 
                                  bgcolor: item.Type === 'Placement' ? '#e8f5e9' : item.Type === 'Result' ? '#e3f2fd' : '#fff3e0', 
                                  color: item.Type === 'Placement' ? '#2e7d32' : item.Type === 'Result' ? '#1565c0' : '#ef6c00' 
                                }}
                              >
                                {item.Type}
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.Timestamp).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default App