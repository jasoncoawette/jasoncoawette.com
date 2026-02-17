let _visited = false;

export function isFirstLoad(): boolean {
	if (!_visited) {
		_visited = true;
		return true;
	}
	return false;
}
