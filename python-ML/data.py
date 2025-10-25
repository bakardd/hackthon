"""Small dataset/constants module used by validation helpers.

This file provides lightweight constants so `validators.py` can import them
without failing. They are intentionally small and independent from the
crop recommendation dataset. They can be extended later if needed.
"""

from typing import FrozenSet


ALLOWED_TEXTURES: FrozenSet[str] = frozenset(
	[
		"sandy",
		"loamy",
		"clay",
		"silty",
		"peaty",
		"chalky",
	]
)


ALLOWED_DRAINAGE: FrozenSet[str] = frozenset(
	["poor", "moderate", "well"],
)


__all__ = ["ALLOWED_TEXTURES", "ALLOWED_DRAINAGE"]
