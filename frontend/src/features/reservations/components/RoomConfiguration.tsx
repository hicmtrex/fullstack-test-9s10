import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

/**
 * Room configuration interface
 */
export interface Room {
  nb_adults: number;
  nb_enfants: number;
  ages_enfants: number[];
}

/**
 * RoomConfiguration component props
 */
export interface RoomConfigurationProps {
  rooms: Room[];
  onAddRoom: () => void;
  onRemoveRoom: (index: number) => void;
  onUpdateRoom: (index: number, field: keyof Room, value: number | number[]) => void;
  onUpdateNbEnfants: (roomIndex: number, nbEnfants: number) => void;
  onUpdateEnfantAge: (roomIndex: number, ageIndex: number, age: number) => void;
}

/**
 * RoomConfiguration component
 * Manages room configuration with adults, children, and children ages
 */
export const RoomConfiguration: React.FC<RoomConfigurationProps> = ({
  rooms,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onUpdateNbEnfants,
  onUpdateEnfantAge,
}) => {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Room Configuration</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddRoom}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="space-y-4">
        {rooms.map((room, roomIndex) => (
          <div key={roomIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Room {roomIndex + 1}</h4>
              {rooms.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onRemoveRoom(roomIndex)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Adults */}
              <Input
                label="Number of Adults"
                type="number"
                min="1"
                value={room.nb_adults}
                onChange={e => onUpdateRoom(roomIndex, 'nb_adults', parseInt(e.target.value) || 1)}
                required
              />

              {/* Number of Children */}
              <Input
                label="Number of Children"
                type="number"
                min="0"
                value={room.nb_enfants}
                onChange={e => onUpdateNbEnfants(roomIndex, parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Children Ages */}
            {room.nb_enfants > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children Ages
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {room.ages_enfants.map((age, ageIndex) => (
                    <Input
                      key={ageIndex}
                      type="number"
                      min="0"
                      max="17"
                      value={age}
                      onChange={e =>
                        onUpdateEnfantAge(roomIndex, ageIndex, parseInt(e.target.value) || 0)
                      }
                      placeholder={`Age ${ageIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

