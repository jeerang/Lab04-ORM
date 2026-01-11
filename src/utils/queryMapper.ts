function isDateString(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
}

function convertQueryValue(key: string, value: any) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string" && isDateString(value)) {
    const date = new Date(value);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    return {
      gte: date,
      lt: nextDay,
    };
  }

  if (typeof value === "string") {
    return { contains: value, mode: "insensitive" };
  }

  return value;
}

export function mapQueryToPrismaOptions(query: Record<string, any>) {
  const where: Record<string, any> = {};
  Object.keys(query).forEach((key) => {
    const converted = convertQueryValue(key, query[key]);
    if (converted !== undefined) {
      where[key] = converted;
    }
  });
  return { where };
}

export function mapQueryToPrismaOptionsWithPagination(
  query: Record<string, any>,
  page: number,
  limit: number
) {
  const where: Record<string, any> = {};
  Object.keys(query).forEach((key) => {
    if (key !== "page" && key !== "limit") {
      const converted = convertQueryValue(key, query[key]);
      if (converted !== undefined) {
        where[key] = converted;
      }
    }
  });
  const skip = (page - 1) * limit;

  return { where, skip, take: limit };
}

export function mapQueryToPrismaOptionsWithOutPagination(
  query: Record<string, any>
) {
  const where: Record<string, any> = {};
  Object.keys(query).forEach((key) => {
    if (key !== "page" && key !== "limit") {
      const converted = convertQueryValue(key, query[key]);
      if (converted !== undefined) {
        where[key] = converted;
      }
    }
  });
  return { where };
}

interface RelationSearchConfig {
  directFields?: string[]; // Direct fields on the model
  relations?: {
    [relationName: string]: {
      fields?: string[]; // Direct fields to search in the relation
      useMany?: boolean; // Use 'some' for one-to-many relations
      nestedRelation?: {
        name: string; // Nested relation name
        fields: string[]; // Fields in nested relation
      };
    };
  };
}

export function buildKeywordSearchWhereWithRelations(
  keyword: string,
  config: RelationSearchConfig
) {
  if (!keyword) return {};

  const orConditions: any[] = [];

  // Add direct field searches
  if (config.directFields) {
    config.directFields.forEach((field) => {
      orConditions.push({
        [field]: { contains: keyword, mode: "insensitive" },
      });
    });
  }

  // Add relation searches
  if (config.relations) {
    Object.entries(config.relations).forEach(
      ([relationName, relationConfig]) => {
        // Handle nested relation (e.g., histories -> member)
        if (relationConfig.nestedRelation) {
          const nestedFieldConditions =
            relationConfig.nestedRelation.fields.map((field) => ({
              [field]: { contains: keyword, mode: "insensitive" },
            }));

          if (relationConfig.useMany) {
            orConditions.push({
              [relationName]: {
                some: {
                  [relationConfig.nestedRelation.name]: {
                    OR: nestedFieldConditions,
                  },
                },
              },
            });
          }
        }
        // Handle direct relation fields
        else if (relationConfig.fields) {
          const fieldConditions = relationConfig.fields.map((field) => ({
            [field]: { contains: keyword, mode: "insensitive" },
          }));

          if (relationConfig.useMany) {
            orConditions.push({
              [relationName]: {
                some: {
                  OR: fieldConditions,
                },
              },
            });
          } else {
            orConditions.push({
              [relationName]: {
                OR: fieldConditions,
              },
            });
          }
        }
      }
    );
  }

  return { OR: orConditions };
}

export function mapQueryWithKeywordSearchAndRelations(
  keyword: string,
  searchConfig: RelationSearchConfig,
  includeConfig: any,
  page: number,
  limit: number
) {
  const where = buildKeywordSearchWhereWithRelations(keyword, searchConfig);
  const skip = (page - 1) * limit;

  return {
    where,
    include: includeConfig,
    skip,
    take: limit,
  };
}

export function mapQueryToPrismaOptionsWithKeywordSearch(
  query: Record<string, any>,
  keyword: string,
  searchFields: string[],
  page: number,
  limit: number
) {
  const where: any = {};

  if (keyword) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: keyword, mode: "insensitive" },
    }));
  }

  Object.keys(query).forEach((key) => {
    if (key !== "page" && key !== "limit" && key !== "keyword") {
      const converted = convertQueryValue(key, query[key]);
      if (converted !== undefined) {
        where[key] = converted;
      }
    }
  });

  const skip = (page - 1) * limit;
  return { where, skip, take: limit };
}

export function mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination(
  query: Record<string, any>,
  keyword: string,
  searchFields: string[]
) {
  const where: any = {};

  if (keyword) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: keyword, mode: "insensitive" },
    }));
  }

  Object.keys(query).forEach((key) => {
    if (key !== "page" && key !== "limit" && key !== "keyword") {
      const converted = convertQueryValue(key, query[key]);
      if (converted !== undefined) {
        where[key] = converted;
      }
    }
  });
  return { where };
}
