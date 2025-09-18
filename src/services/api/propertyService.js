import propertiesData from "@/services/mockData/properties.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(Math.random() * 300 + 200);
    return [...propertiesData];
  },

  async getById(Id) {
    await delay(Math.random() * 200 + 100);
    const property = propertiesData.find(item => item.Id === Id);
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(Math.random() * 300 + 200);
    const highestId = Math.max(...propertiesData.map(item => item.Id));
    const newProperty = {
      Id: highestId + 1,
      ...propertyData,
      listingDate: new Date().toISOString(),
      status: "For Sale"
    };
    propertiesData.push(newProperty);
    return { ...newProperty };
  },

  async update(Id, updates) {
    await delay(Math.random() * 300 + 200);
    const index = propertiesData.findIndex(item => item.Id === Id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    propertiesData[index] = { ...propertiesData[index], ...updates };
    return { ...propertiesData[index] };
  },

  async delete(Id) {
    await delay(Math.random() * 200 + 100);
    const index = propertiesData.findIndex(item => item.Id === Id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deletedProperty = { ...propertiesData[index] };
    propertiesData.splice(index, 1);
    return deletedProperty;
  }
};