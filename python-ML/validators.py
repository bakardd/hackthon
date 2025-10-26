"""Basic validation and normalization helpers."""
from __future__ import annotations
from typing import Tuple
from data import ALLOWED_TEXTURES, ALLOWED_DRAINAGE


class ValidationError(ValueError):
    pass


def ensure_ph_bounds(ph: float) -> float:
    # bind pH to range 0–14.
    return max(0.0, min(14.0, float(ph)))


def normalize_texture(s: str) -> str:
    # normalize tokens.
    key = s.strip().lower().replace(" ", "_")
    if key not in ALLOWED_TEXTURES:
        raise ValidationError(f"soil_texture must be one of {sorted(ALLOWED_TEXTURES)}; got '{s}'")
    return key


def normalize_drainage(s: str) -> str:
    key = s.strip().lower()
    if key not in ALLOWED_DRAINAGE:
        raise ValidationError(f"drainage must be one of {sorted(ALLOWED_DRAINAGE)}; got '{s}'")
    return key


def band(value: float, low: float, high: float) -> str:
    # return label for where value sits vs range.
    if value < low:
        return "below"
    if value > high:
        return "above"
    return "within"