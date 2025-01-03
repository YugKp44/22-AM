const { google } = require('googleapis');
const { logger } = require('../config/logging');

const analyticsData = google.analyticsdata('v1beta');

const getAnalyticsData = async (accessToken, options) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const response = await analyticsData.properties.runReport({
      auth,
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{
          startDate: options.startDate,
          endDate: options.endDate
        }],
        metrics: options.metrics.map(metric => ({ name: metric })),
        dimensions: options.dimensions.map(dimension => ({ name: dimension }))
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Error fetching analytics data:', error);
    throw error;
  }
};

const getRealTimeData = async (accessToken) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const response = await analyticsData.properties.runRealtimeReport({
      auth,
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }]
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Error fetching realtime data:', error);
    throw error;
  }
};

module.exports = {
  getAnalyticsData,
  getRealTimeData
};