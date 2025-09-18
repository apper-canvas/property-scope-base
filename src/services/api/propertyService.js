export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_footage_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('property_c', params);

      if (!response?.data?.length) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: property.address_c || '',
        city: property.city_c || '',
        state: property.state_c || '',
        zipCode: property.zip_code_c || '',
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        squareFootage: property.square_footage_c || 0,
        lotSize: property.lot_size_c || 0,
        propertyType: property.property_type_c || '',
        yearBuilt: property.year_built_c || 0,
        images: property.images_c ? property.images_c.split(',').map(img => img.trim()) : ['/api/placeholder/400/250'],
        description: property.description_c || '',
        features: property.features_c ? property.features_c.split('\n').map(f => f.trim()) : [],
        listingDate: property.listing_date_c || new Date().toISOString(),
        status: property.status_c || 'For Sale'
      }));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_footage_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('property_c', Id, params);

      if (!response?.data) {
        throw new Error("Property not found");
      }

      // Transform data to match UI expectations
      const property = response.data;
      return {
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: property.address_c || '',
        city: property.city_c || '',
        state: property.state_c || '',
        zipCode: property.zip_code_c || '',
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        squareFootage: property.square_footage_c || 0,
        lotSize: property.lot_size_c || 0,
        propertyType: property.property_type_c || '',
        yearBuilt: property.year_built_c || 0,
        images: property.images_c ? property.images_c.split(',').map(img => img.trim()) : ['/api/placeholder/400/250'],
        description: property.description_c || '',
        features: property.features_c ? property.features_c.split('\n').map(f => f.trim()) : [],
        listingDate: property.listing_date_c || new Date().toISOString(),
        status: property.status_c || 'For Sale'
      };
    } catch (error) {
      console.error(`Error fetching property ${Id}:`, error?.response?.data?.message || error);
      throw new Error("Property not found");
    }
  },

  async create(propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database field names (only updateable fields)
      const params = {
        records: [{
          Name: propertyData.title,
          title_c: propertyData.title,
          price_c: propertyData.price,
          address_c: propertyData.address,
          city_c: propertyData.city,
          state_c: propertyData.state,
          zip_code_c: propertyData.zipCode,
          bedrooms_c: propertyData.bedrooms,
          bathrooms_c: propertyData.bathrooms,
          square_footage_c: propertyData.squareFootage,
          lot_size_c: propertyData.lotSize,
          property_type_c: propertyData.propertyType,
          year_built_c: propertyData.yearBuilt,
          images_c: Array.isArray(propertyData.images) ? propertyData.images.join(', ') : propertyData.images,
          description_c: propertyData.description,
          features_c: Array.isArray(propertyData.features) ? propertyData.features.join('\n') : propertyData.features,
          listing_date_c: new Date().toISOString(),
          status_c: 'For Sale'
        }]
      };

      const response = await apperClient.createRecord('property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create property");
    } catch (error) {
      console.error("Error creating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(Id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database field names (only updateable fields)
      const record = { Id };
      
      if (updates.title !== undefined) record.title_c = updates.title;
      if (updates.price !== undefined) record.price_c = updates.price;
      if (updates.address !== undefined) record.address_c = updates.address;
      if (updates.city !== undefined) record.city_c = updates.city;
      if (updates.state !== undefined) record.state_c = updates.state;
      if (updates.zipCode !== undefined) record.zip_code_c = updates.zipCode;
      if (updates.bedrooms !== undefined) record.bedrooms_c = updates.bedrooms;
      if (updates.bathrooms !== undefined) record.bathrooms_c = updates.bathrooms;
      if (updates.squareFootage !== undefined) record.square_footage_c = updates.squareFootage;
      if (updates.lotSize !== undefined) record.lot_size_c = updates.lotSize;
      if (updates.propertyType !== undefined) record.property_type_c = updates.propertyType;
      if (updates.yearBuilt !== undefined) record.year_built_c = updates.yearBuilt;
      if (updates.images !== undefined) record.images_c = Array.isArray(updates.images) ? updates.images.join(', ') : updates.images;
      if (updates.description !== undefined) record.description_c = updates.description;
      if (updates.features !== undefined) record.features_c = Array.isArray(updates.features) ? updates.features.join('\n') : updates.features;
      if (updates.status !== undefined) record.status_c = updates.status;

      const params = { records: [record] };

      const response = await apperClient.updateRecord('property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update property");
    } catch (error) {
      console.error("Error updating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [Id] };

      const response = await apperClient.deleteRecord('property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      throw new Error("Failed to delete property");
    } catch (error) {
      console.error("Error deleting property:", error?.response?.data?.message || error);
      throw error;
    }
  }
};