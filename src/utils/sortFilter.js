export function filterData(data, filterKey, filterValue) {
  if (!filterValue || filterValue === "all") return data;
  return data.filter(item => item[filterKey] === filterValue);
}

export function sortData(data, sortType) {
  const sorted = [...data];

  if (sortType === "az") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortType === "za") {
    return sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sortType === "latest") {
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sortType === "oldest") {
    return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return sorted;
}
