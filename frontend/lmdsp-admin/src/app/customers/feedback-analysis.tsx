'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react'

const recentReviews = [
  {
    id: 1,
    customer: 'John Smith',
    order: 'LMDSP-BR-150924-001',
    rating: 5,
    comment: 'Excellent service! The courier was very professional and delivered ahead of schedule.',
    date: '2024-01-15T14:30:00Z',
    sentiment: 'positive'
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    order: 'LMDSP-BR-150924-002',
    rating: 4,
    comment: 'Good service but there was a slight delay in delivery. Courier was polite though.',
    date: '2024-01-14T16:45:00Z',
    sentiment: 'neutral'
  },
  {
    id: 3,
    customer: 'Mike Davis',
    order: 'LMDSP-BR-150924-003',
    rating: 2,
    comment: 'Package arrived damaged and the courier was not helpful. Very disappointed.',
    date: '2024-01-13T11:20:00Z',
    sentiment: 'negative'
  },
  {
    id: 4,
    customer: 'Lisa Brown',
    order: 'LMDSP-BR-150924-004',
    rating: 5,
    comment: 'Fast and reliable service as always. This is why I keep coming back!',
    date: '2024-01-12T09:15:00Z',
    sentiment: 'positive'
  }
]

const sentimentStats = {
  positive: 68,
  neutral: 25,
  negative: 7
}

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 65 },
  { stars: 4, count: 15, percentage: 22 },
  { stars: 3, count: 5, percentage: 7 },
  { stars: 2, count: 3, percentage: 4 },
  { stars: 1, count: 2, percentage: 3 }
]

export default function FeedbackAnalysis() {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Reviews</CardTitle>
          <CardDescription>
            Latest feedback and ratings from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{review.customer}</div>
                    <div className="text-sm text-gray-500">Order: {review.order}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                      {getSentimentIcon(review.sentiment)}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(review.date)}</span>
                  <Button variant="ghost" size="sm">
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Analytics */}
      <div className="space-y-6">
        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>
              Customer feedback sentiment distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(sentimentStats).map(([sentiment, percentage]) => (
                <div key={sentiment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSentimentIcon(sentiment)}
                    <span className="text-sm font-medium capitalize">{sentiment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          sentiment === 'positive' ? 'bg-green-500' :
                          sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of customer ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center w-16">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rating.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({rating.count})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium w-8">{rating.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Response Metrics</CardTitle>
            <CardDescription>
              Feedback response performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-green-600">4.2h</div>
                <div className="text-xs text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-blue-600">92%</div>
                <div className="text-xs text-gray-600">Response Rate</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-purple-600">78%</div>
                <div className="text-xs text-gray-600">Issue Resolution</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-orange-600">45</div>
                <div className="text-xs text-gray-600">Reviews This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
