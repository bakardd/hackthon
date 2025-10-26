"""Basic validation helpers used elsewhere (not required for training)."""
from __future__ import annotations

class ValidationError(ValueError):
    pass


def ensure_ph_bounds(ph: float) -> float:
    """Clamp pH into the inclusive range [0.0, 14.0]."""
    return max(0.0, min(14.0, float(ph)))


def band(value: float, low: float, high: float) -> str:
    """Return a label for where `value` sits relative to `[low, high]`."""
    if value < low:
        return "below"
    if value > high:
        return "above"
    return "within"